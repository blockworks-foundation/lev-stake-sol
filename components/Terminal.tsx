import { useWallet } from '@solana/wallet-adapter-react'
import mangoStore from '@store/mangoStore'
import { useViewport } from 'hooks/useViewport'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { STAKEABLE_TOKENS_DATA } from 'utils/constants'

const Terminal: React.FC<{ activeFormTab: 'Add' | 'Remove' }> = ({
  activeFormTab,
}) => {
  const selectedToken = mangoStore((s) => s.selectedToken)
  const selectedMint = useMemo(
    () =>
      STAKEABLE_TOKENS_DATA.find((item) => item.name === selectedToken)
        ?.address,
    [selectedToken],
  )
  const connection = mangoStore((s) => s.connection)

  const { isDesktop } = useViewport()
  const passthroughWalletContextState = useWallet()

  const launchTerminal = useCallback(() => {
    window.Jupiter.init({
      displayMode: 'widget',
      widgetStyle: {
        position: 'bottom-left',
        size: isDesktop ? 'default' : 'sm',
      },
      endpoint: connection.rpcEndpoint,
      formProps:
        activeFormTab === 'Add'
          ? {
              initialOutputMint: selectedMint ?? undefined,
            }
          : {
              initialInputMint: selectedMint ?? undefined,
            },
      enableWalletPassthrough: true,
      passthroughWalletContextState,
      onRequestConnectWallet: () => {
        document.getElementById('connect-wallet-button')?.click()
      },
      strictTokenList: true,
    })
  }, [
    activeFormTab,
    connection.rpcEndpoint,
    isDesktop,
    passthroughWalletContextState,
    selectedMint,
  ])

  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined
    if (!isLoaded || !window.Jupiter.init || !intervalId) {
      intervalId = setInterval(() => {
        setIsLoaded(Boolean(window.Jupiter.init))
      }, 500)
    }

    if (intervalId) {
      return () => clearInterval(Number(intervalId))
    }
  }, [isLoaded])

  useEffect(() => {
    setTimeout(() => {
      if (isLoaded && Boolean(window.Jupiter.init)) {
        launchTerminal()
        document.getElementById('jupiter-terminal')?.classList.add('z-50')
        document.getElementById('jupiter-terminal')?.classList.add('fixed')
      }
    }, 200)
  }, [isLoaded, launchTerminal])

  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return
    window.Jupiter.syncProps({ passthroughWalletContextState })
  }, [passthroughWalletContextState])

  return <></>
}

export default Terminal
