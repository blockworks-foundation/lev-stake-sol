import { AnchorProvider, BN } from '@coral-xyz/anchor'
import {
  Bank,
  FlashLoanType,
  Group,
  I80F48,
  MangoAccount,
  MangoClient,
  MangoSignatureStatus,
  RouteInfo,
  TokenIndex,
  TokenPosition,
  U64_MAX_BN,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddress,
  toNative,
  toNativeI80F48,
  toUiDecimals,
} from '@blockworks-foundation/mango-v4'
import { TOKEN_PROGRAM_ID } from '@solana/spl-governance'
import {
  NATIVE_MINT,
  createCloseAccountInstruction,
  createInitializeAccount3Instruction,
} from '@solana/spl-token'
import {
  AccountMeta,
  AddressLookupTableAccount,
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { floorToDecimal } from './numbers'
import { BOOST_ACCOUNT_PREFIX } from './constants'
import { notify } from './notifications'

export const withdrawAndClose = async (
  client: MangoClient,
  group: Group,
  mangoAccount: MangoAccount,
  stakeMintPk: PublicKey,
  amount: number,
) => {
  console.log('withdraw and close')

  const borrowBank = group?.banksMapByName.get('USDC')?.[0]
  const stakeBank = group?.banksMapByMint.get(stakeMintPk.toString())?.[0]
  const instructions: TransactionInstruction[] = []

  if (!borrowBank || !stakeBank || !mangoAccount) {
    throw Error('Unable to find USDC bank or stake bank or mango account')
  }
  const stakeBalance = mangoAccount.getTokenBalanceUi(stakeBank)
  const withdrawHealthRemainingAccounts: PublicKey[] =
    client.buildHealthRemainingAccounts(group, [mangoAccount], [], [], [])
  const withdrawMax =
    amount >= floorToDecimal(stakeBalance, stakeBank.mintDecimals).toNumber()
  console.log('withdrawMax: ', withdrawMax)

  const nativeWithdrawAmount = toNative(
    amount,
    group.getMintDecimals(stakeBank.mint),
  )

  if (withdrawMax) {
    for (const tp of mangoAccount.tokensActive()) {
      const bank = group.getFirstBankByTokenIndex(tp.tokenIndex)
      const withdrawIx = await client.tokenWithdrawNativeIx(
        group,
        mangoAccount,
        bank.mint,
        U64_MAX_BN,
        false,
      )
      instructions.push(...withdrawIx)
      tp.tokenIndex = TokenPosition.TokenIndexUnset as TokenIndex
    }
    const closeIx = await client.program.methods
      .accountClose(false)
      .accounts({
        group: group.publicKey,
        account: mangoAccount.publicKey,
        owner: (client.program.provider as AnchorProvider).wallet.publicKey,
        solDestination: mangoAccount.owner,
      })
      .instruction()
    instructions.push(closeIx)
  } else {
    const withdrawIx = await tokenWithdrawNativeIx(
      client,
      group,
      mangoAccount,
      stakeBank.mint,
      withdrawMax ? new BN('18446744073709551615', 10) : nativeWithdrawAmount,
      false,
      withdrawHealthRemainingAccounts,
    )
    instructions.push(...withdrawIx)
  }

  return await client.sendAndConfirmTransactionForGroup(group, instructions, {
    alts: [...group.addressLookupTablesList],
  })
}

export const unstakeAndSwap = async (
  client: MangoClient,
  group: Group,
  mangoAccount: MangoAccount,
  stakeMintPk: PublicKey,
  stakeAmountToRepay?: number,
): Promise<MangoSignatureStatus> => {
  console.log('unstake and swap')

  const payer = (client.program.provider as AnchorProvider).wallet.publicKey
  const borrowBank = group?.banksMapByName.get('USDC')?.[0]
  const stakeBank = group?.banksMapByMint.get(stakeMintPk.toString())?.[0]
  const instructions: TransactionInstruction[] = []

  if (!borrowBank || !stakeBank || !mangoAccount) {
    throw Error('Unable to find borrow bank or stake bank or mango account')
  }
  const borrowed = mangoAccount.getTokenBalance(borrowBank)

  let swapAlts: AddressLookupTableAccount[] = []
  if (borrowed.toNumber() < 0) {
    const toRepay = Math.ceil(
      (stakeAmountToRepay
        ? toNativeI80F48(stakeAmountToRepay, stakeBank.mintDecimals)
        : borrowed.abs().div(stakeBank.getAssetPrice())
      )
        .add(I80F48.fromNumber(100))
        .toNumber(),
    )

    console.log('borrowedSol amount: ', borrowed.toNumber())
    console.log('borrow needed to repay for withdraw', toRepay)
    const slippage = 1

    const { bestRoute: selectedRoute } = await fetchJupiterRoutes(
      stakeMintPk.toString(),
      borrowBank.mint.toString(),
      Math.ceil(toRepay),
      slippage,
      'ExactIn',
      0,
      false,
    )
    console.log(selectedRoute)

    if (!selectedRoute) {
      throw Error('Unable to find a swap route')
    }

    const [jupiterIxs, jupiterAlts] = await fetchJupiterTransaction(
      client.program.provider.connection,
      selectedRoute,
      payer,
      slippage,
      borrowBank.mint,
      stakeMintPk,
    )

    const swapHealthRemainingAccounts: PublicKey[] = mangoAccount
      ? client.buildHealthRemainingAccounts(group, [mangoAccount], [], [], [])
      : [stakeBank.publicKey, stakeBank.oracle]
    const [swapIxs, alts] = await createSwapIxs({
      client: client,
      group: group,
      mangoAccountPk: mangoAccount.publicKey,
      owner: payer,
      inputMintPk: stakeBank.mint,
      amountIn: toUiDecimals(selectedRoute.inAmount, stakeBank.mintDecimals),
      outputMintPk: borrowBank.mint,
      userDefinedInstructions: jupiterIxs,
      userDefinedAlts: jupiterAlts,
      flashLoanType: FlashLoanType.swap,
      swapHealthRemainingAccounts,
    })
    swapAlts = alts
    instructions.push(...swapIxs)
  }

  return await client.sendAndConfirmTransactionForGroup(group, instructions, {
    alts: [...group.addressLookupTablesList, ...swapAlts],
  })
}

export const stakeAndCreate = async (
  client: MangoClient,
  group: Group,
  mangoAccount: MangoAccount | undefined,
  borrowAmount: number,
  stakeMintPk: PublicKey,
  amount: number,
  accountNumber: number,
  name?: string,
): Promise<MangoSignatureStatus> => {
  const payer = (client.program.provider as AnchorProvider).wallet.publicKey
  const borrowBank = group?.banksMapByName.get('USDC')?.[0]
  const stakeBank = group?.banksMapByMint.get(stakeMintPk.toString())?.[0]
  const instructions: TransactionInstruction[] = []

  if (!borrowBank || !stakeBank) {
    throw Error('Unable to find Borrow bank or Stake bank')
  }

  let mangoAccountPk = mangoAccount?.publicKey

  if (!mangoAccountPk) {
    const createMangoAccountIx = await client.program.methods
      .accountCreate(
        accountNumber ?? 0,
        4,
        0, // serum
        0, // perp
        0, // perp OO
        name ?? `${BOOST_ACCOUNT_PREFIX}${stakeBank.name}`,
      )
      .accounts({
        group: group.publicKey,
        owner: payer,
        payer,
      })
      .instruction()
    instructions.push(createMangoAccountIx)

    const acctNumBuffer = Buffer.alloc(4)
    acctNumBuffer.writeUInt32LE(accountNumber)
    const [mangoAccountPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('MangoAccount'),
        group.publicKey.toBuffer(),
        payer.toBuffer(),
        acctNumBuffer,
      ],
      client.program.programId,
    )
    mangoAccountPk = mangoAccountPda
  }

  const depositHealthRemainingAccounts: PublicKey[] = mangoAccount
    ? client.buildHealthRemainingAccounts(
        group,
        [mangoAccount],
        [stakeBank],
        [],
        [],
      )
    : [stakeBank.publicKey, stakeBank.oracle]
  const depositTokenIxs = await createDepositIx(
    client,
    group,
    payer,
    mangoAccountPk,
    stakeMintPk,
    amount,
    false,
    depositHealthRemainingAccounts,
  )
  instructions.push(...depositTokenIxs)

  let swapAlts: AddressLookupTableAccount[] = []
  const nativeBorrowAmount = toNative(
    borrowAmount,
    borrowBank.mintDecimals,
  ).toNumber()

  if (nativeBorrowAmount) {
    const { bestRoute: selectedRoute } = await fetchJupiterRoutes(
      borrowBank.mint.toString(),
      stakeMintPk.toString(),
      nativeBorrowAmount,
    )

    if (!selectedRoute) {
      throw Error('Unable to find a swap route')
    }
    const slippage = 100 // bips

    const [jupiterIxs, jupiterAlts] = await fetchJupiterTransaction(
      client.program.provider.connection,
      selectedRoute,
      payer,
      slippage,
      borrowBank.mint,
      stakeMintPk,
    )

    const [swapIxs, alts] = await createSwapIxs({
      client: client,
      group: group,
      mangoAccountPk,
      owner: payer,
      inputMintPk: borrowBank.mint,
      amountIn: borrowAmount,
      outputMintPk: stakeBank.mint,
      userDefinedInstructions: jupiterIxs,
      userDefinedAlts: jupiterAlts,
      // margin trade is a general function
      flashLoanType: FlashLoanType.swap,
    })
    swapAlts = alts
    instructions.push(...swapIxs)
  }

  return await client.sendAndConfirmTransactionForGroup(group, instructions, {
    alts: [...group.addressLookupTablesList, ...swapAlts],
  })
}

export const depositAndCreate = async (
  client: MangoClient,
  group: Group,
  mangoAccount: MangoAccount | undefined,
  stakeMintPk: PublicKey,
  amount: number,
  accountNumber: number,
  name?: string,
): Promise<MangoSignatureStatus> => {
  const payer = (client.program.provider as AnchorProvider).wallet.publicKey
  const depositBank = group?.banksMapByMint.get(stakeMintPk.toString())?.[0]
  const instructions: TransactionInstruction[] = []

  if (!depositBank) {
    throw Error('Unable to find Deposit bank')
  }

  let mangoAccountPk = mangoAccount?.publicKey

  if (!mangoAccountPk) {
    const createMangoAccountIx = await client.program.methods
      .accountCreate(
        accountNumber ?? 0,
        2,
        0, // serum
        0, // perp
        0, // perp OO
        name ?? `${BOOST_ACCOUNT_PREFIX}${depositBank.name}`,
      )
      .accounts({
        group: group.publicKey,
        owner: payer,
        payer,
      })
      .instruction()
    instructions.push(createMangoAccountIx)

    const acctNumBuffer = Buffer.alloc(4)
    acctNumBuffer.writeUInt32LE(accountNumber)
    const [mangoAccountPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('MangoAccount'),
        group.publicKey.toBuffer(),
        payer.toBuffer(),
        acctNumBuffer,
      ],
      client.program.programId,
    )
    mangoAccountPk = mangoAccountPda
  }

  const depositHealthRemainingAccounts: PublicKey[] = mangoAccount
    ? client.buildHealthRemainingAccounts(
        group,
        [mangoAccount],
        [depositBank],
        [],
        [],
      )
    : [depositBank.publicKey, depositBank.oracle]

  const depositTokenIxs = await createDepositIx(
    client,
    group,
    payer,
    mangoAccountPk,
    stakeMintPk,
    amount,
    false,
    depositHealthRemainingAccounts,
  )
  instructions.push(...depositTokenIxs)

  return await client.sendAndConfirmTransactionForGroup(group, instructions, {
    alts: [],
  })
}

const createDepositIx = async (
  client: MangoClient,
  group: Group,
  mangoAccountOwner: PublicKey,
  mangoAccountPk: PublicKey,
  mintPk: PublicKey,
  amount: number,
  reduceOnly = false,
  healthRemainingAccounts: PublicKey[],
) => {
  const decimals = group.getMintDecimals(mintPk)
  const nativeAmount = toNative(amount, decimals)
  const bank = group.getFirstBankByMint(mintPk)

  const tokenAccountPk = await getAssociatedTokenAddress(
    mintPk,
    mangoAccountOwner,
  )

  let wrappedSolAccount: PublicKey | undefined
  let preInstructions: TransactionInstruction[] = []
  let postInstructions: TransactionInstruction[] = []
  if (mintPk.equals(NATIVE_MINT)) {
    // Generate a random seed for wrappedSolAccount.
    const seed = Keypair.generate().publicKey.toBase58().slice(0, 32)
    // Calculate a publicKey that will be controlled by the `mangoAccountOwner`.
    wrappedSolAccount = await PublicKey.createWithSeed(
      mangoAccountOwner,
      seed,
      TOKEN_PROGRAM_ID,
    )

    const lamports = nativeAmount.add(new BN(1e7))

    preInstructions = [
      SystemProgram.createAccountWithSeed({
        fromPubkey: mangoAccountOwner,
        basePubkey: mangoAccountOwner,
        seed,
        newAccountPubkey: wrappedSolAccount,
        lamports: lamports.toNumber(),
        space: 165,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeAccount3Instruction(
        wrappedSolAccount,
        NATIVE_MINT,
        mangoAccountOwner,
      ),
    ]
    postInstructions = [
      createCloseAccountInstruction(
        wrappedSolAccount,
        mangoAccountOwner,
        mangoAccountOwner,
      ),
    ]
  }

  const ix = await client.program.methods
    .tokenDeposit(new BN(nativeAmount), reduceOnly)
    .accounts({
      group: group.publicKey,
      account: mangoAccountPk,
      owner: mangoAccountOwner,
      bank: bank.publicKey,
      vault: bank.vault,
      oracle: bank.oracle,
      tokenAccount: wrappedSolAccount ?? tokenAccountPk,
      tokenAuthority: mangoAccountOwner,
    })
    .remainingAccounts(
      healthRemainingAccounts.map(
        (pk) =>
          ({ pubkey: pk, isWritable: false, isSigner: false }) as AccountMeta,
      ),
    )
    .instruction()

  return [...preInstructions, ix, ...postInstructions]
}

const createSwapIxs = async ({
  client,
  group,
  mangoAccountPk,
  owner,
  inputMintPk,
  amountIn,
  outputMintPk,
  userDefinedInstructions,
  userDefinedAlts = [],
  // margin trade is a general function
  // set flash_loan_type to FlashLoanType.swap if you desire the transaction to be recorded as a swap
  flashLoanType,
  swapHealthRemainingAccounts,
}: {
  client: MangoClient
  group: Group
  mangoAccountPk: PublicKey
  owner: PublicKey
  inputMintPk: PublicKey
  amountIn: number
  outputMintPk: PublicKey
  userDefinedInstructions: TransactionInstruction[]
  userDefinedAlts: AddressLookupTableAccount[]
  flashLoanType: FlashLoanType
  swapHealthRemainingAccounts?: PublicKey[]
}): Promise<[TransactionInstruction[], AddressLookupTableAccount[]]> => {
  const swapExecutingWallet = owner

  const inputBank: Bank = group.getFirstBankByMint(inputMintPk)
  const outputBank: Bank = group.getFirstBankByMint(outputMintPk)

  const healthRemainingAccounts: PublicKey[] = swapHealthRemainingAccounts
    ? swapHealthRemainingAccounts
    : [
        outputBank.publicKey,
        inputBank.publicKey,
        outputBank.oracle,
        inputBank.oracle,
      ]
  // client.buildHealthRemainingAccounts(
  //   group,
  //   [],
  //   [inputBank, outputBank],
  //   [],
  //   [],
  // )
  const parsedHealthAccounts = healthRemainingAccounts.map(
    (pk) =>
      ({
        pubkey: pk,
        isWritable: false,
        isSigner: false,
      }) as AccountMeta,
  )

  /*
   * Find or create associated token accounts
   */
  const inputTokenAccountPk = await getAssociatedTokenAddress(
    inputBank.mint,
    swapExecutingWallet,
    true,
  )
  const inputTokenAccExists =
    await client.program.provider.connection.getAccountInfo(inputTokenAccountPk)
  const preInstructions: TransactionInstruction[] = []
  if (!inputTokenAccExists) {
    preInstructions.push(
      await createAssociatedTokenAccountIdempotentInstruction(
        swapExecutingWallet,
        swapExecutingWallet,
        inputBank.mint,
      ),
    )
  }

  const outputTokenAccountPk = await getAssociatedTokenAddress(
    outputBank.mint,
    swapExecutingWallet,
    true,
  )
  const outputTokenAccExists =
    await client.program.provider.connection.getAccountInfo(
      outputTokenAccountPk,
    )
  if (!outputTokenAccExists) {
    preInstructions.push(
      await createAssociatedTokenAccountIdempotentInstruction(
        swapExecutingWallet,
        swapExecutingWallet,
        outputBank.mint,
      ),
    )
  }

  const inputBankAccount = {
    pubkey: inputBank.publicKey,
    isWritable: true,
    isSigner: false,
  }
  const outputBankAccount = {
    pubkey: outputBank.publicKey,
    isWritable: true,
    isSigner: false,
  }
  const inputBankVault = {
    pubkey: inputBank.vault,
    isWritable: true,
    isSigner: false,
  }
  const outputBankVault = {
    pubkey: outputBank.vault,
    isWritable: true,
    isSigner: false,
  }
  const inputATA = {
    pubkey: inputTokenAccountPk,
    isWritable: true,
    isSigner: false,
  }
  const outputATA = {
    pubkey: outputTokenAccountPk,
    isWritable: false,
    isSigner: false,
  }
  const groupAM = {
    pubkey: group.publicKey,
    isWritable: false,
    isSigner: false,
  }

  const flashLoanEndIx = await client.program.methods
    .flashLoanEndV2(2, flashLoanType)
    .accounts({
      account: mangoAccountPk,
      owner: (client.program.provider as AnchorProvider).wallet.publicKey,
    })
    .remainingAccounts([
      ...parsedHealthAccounts,
      inputBankVault,
      outputBankVault,
      inputATA,
      {
        isWritable: true,
        pubkey: outputTokenAccountPk,
        isSigner: false,
      },
      groupAM,
    ])
    .instruction()

  const flashLoanBeginIx = await client.program.methods
    .flashLoanBegin([
      toNative(amountIn, inputBank.mintDecimals),
      new BN(
        0,
      ) /* we don't care about borrowing the target amount, this is just a dummy */,
    ])
    .accounts({
      account: mangoAccountPk,
      owner: (client.program.provider as AnchorProvider).wallet.publicKey,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .remainingAccounts([
      inputBankAccount,
      outputBankAccount,
      inputBankVault,
      outputBankVault,
      inputATA,
      outputATA,
      groupAM,
    ])
    .instruction()

  return [
    [
      ...preInstructions,
      flashLoanBeginIx,
      ...userDefinedInstructions.filter((ix) => ix.keys.length > 2),
      flashLoanEndIx,
    ],
    [...group.addressLookupTablesList, ...userDefinedAlts],
  ]
}

export const fetchJupiterTransaction = async (
  connection: Connection,
  selectedRoute: RouteInfo,
  userPublicKey: PublicKey,
  slippage: number,
  inputMint: PublicKey,
  outputMint: PublicKey,
): Promise<[TransactionInstruction[], AddressLookupTableAccount[]]> => {
  const transactions = await (
    await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // route from /quote api
        quoteResponse: selectedRoute,
        // user public key to be used for the swap
        userPublicKey,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // This is the ATA account for the output token where the fee will be sent to. If you are swapping from SOL->USDC then this would be the USDC ATA you want to collect the fee.
        // feeAccount: 'fee_account_public_key',
        slippageBps: Math.ceil(slippage * 100),
        prioritizationFeeLamports: 'auto',
      }),
    })
  ).json()

  const { swapTransaction } = transactions

  const [ixs, alts] = await deserializeJupiterIxAndAlt(
    connection,
    swapTransaction,
  )

  const isSetupIx = (pk: PublicKey): boolean =>
    pk.toString() === 'ComputeBudget111111111111111111111111111111' ||
    pk.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

  const isDuplicateAta = (ix: TransactionInstruction): boolean => {
    return (
      ix.programId.toString() ===
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL' &&
      (ix.keys[3].pubkey.toString() === inputMint.toString() ||
        ix.keys[3].pubkey.toString() === outputMint.toString())
    )
  }

  const filtered_jup_ixs = ixs
    .filter((ix) => !isSetupIx(ix.programId))
    .filter((ix) => !isDuplicateAta(ix))

  return [filtered_jup_ixs, alts]
}

const deserializeJupiterIxAndAlt = async (
  connection: Connection,
  swapTransaction: string,
): Promise<[TransactionInstruction[], AddressLookupTableAccount[]]> => {
  const parsedSwapTransaction = VersionedTransaction.deserialize(
    Buffer.from(swapTransaction, 'base64'),
  )
  const message = parsedSwapTransaction.message
  // const lookups = message.addressTableLookups
  const addressLookupTablesResponses = await Promise.all(
    message.addressTableLookups.map((alt) =>
      connection.getAddressLookupTable(alt.accountKey),
    ),
  )
  const addressLookupTables: AddressLookupTableAccount[] =
    addressLookupTablesResponses
      .map((alt) => alt.value)
      .filter((x): x is AddressLookupTableAccount => x !== null)

  const decompiledMessage = TransactionMessage.decompile(message, {
    addressLookupTableAccounts: addressLookupTables,
  })

  return [decompiledMessage.instructions, addressLookupTables]
}

const fetchJupiterRoutes = async (
  inputMint: string,
  outputMint: string,
  amount = 0,
  slippage = 5,
  swapMode = 'ExactIn',
  feeBps = 0,
  onlyDirectRoutes = true,
) => {
  try {
    const paramsString = new URLSearchParams({
      inputMint: inputMint.toString(),
      outputMint: outputMint.toString(),
      amount: amount.toString(),
      slippageBps: Math.ceil(slippage * 100).toString(),
      feeBps: feeBps.toString(),
      swapMode,
      onlyDirectRoutes: `${onlyDirectRoutes}`,
    }).toString()

    const response = await fetch(
      `https://quote-api.jup.ag/v6/quote?${paramsString}`,
    )
    const res = await response.json()
    if (res.error) {
      throw res.error
    }
    return {
      bestRoute: res as RouteInfo | null,
    }
  } catch (e) {
    console.log(e, 'Error finding jupiter route')
    notify({
      title: `Error finding jupiter route ${e}`,
      type: 'info',
    })
    return {
      bestRoute: null,
    }
  }
}

const tokenWithdrawNativeIx = async (
  client: MangoClient,
  group: Group,
  mangoAccount: MangoAccount,
  mintPk: PublicKey,
  nativeAmount: BN,
  allowBorrow: boolean,
  healthRemainingAccounts: PublicKey[],
): Promise<TransactionInstruction[]> => {
  const bank = group.getFirstBankByMint(mintPk)

  const tokenAccountPk = await getAssociatedTokenAddress(
    bank.mint,
    mangoAccount.owner,
    true,
  )

  // ensure withdraws don't fail with missing ATAs
  const preInstructions: TransactionInstruction[] = [
    await createAssociatedTokenAccountIdempotentInstruction(
      mangoAccount.owner,
      mangoAccount.owner,
      bank.mint,
    ),
  ]

  const postInstructions: TransactionInstruction[] = []
  if (mintPk.equals(NATIVE_MINT)) {
    postInstructions.push(
      createCloseAccountInstruction(
        tokenAccountPk,
        mangoAccount.owner,
        mangoAccount.owner,
      ),
    )
  }

  const ix = await client.program.methods
    .tokenWithdraw(new BN(nativeAmount), allowBorrow)
    .accounts({
      group: group.publicKey,
      account: mangoAccount.publicKey,
      owner: mangoAccount.owner,
      bank: bank.publicKey,
      vault: bank.vault,
      oracle: bank.oracle,
      tokenAccount: tokenAccountPk,
    })
    .remainingAccounts(
      healthRemainingAccounts.map(
        (pk) =>
          ({
            pubkey: pk,
            isWritable: false,
            isSigner: false,
          }) as AccountMeta,
      ),
    )
    .instruction()

  return [...preInstructions, ix, ...postInstructions]
}
