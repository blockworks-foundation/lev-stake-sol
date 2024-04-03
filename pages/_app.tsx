import '../styles/globals.css'
import 'react-range-slider-input/dist/style.css'

import type { AppProps } from 'next/app'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Adapter,
  WalletAdapterNetwork,
  WalletError,
  WalletName,
  WalletNotReadyError,
} from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  GlowWalletAdapter,
  BackpackWalletAdapter,
  BraveWalletAdapter,
  CoinbaseWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  CloverWalletAdapter,
  LedgerWalletAdapter,
  ExodusWalletAdapter,
  WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import TransactionNotification from '@components/notifications/TransactionNotification'
import { ThemeProvider } from 'next-themes'
import { appWithTranslation } from 'next-i18next'
import Layout from '../components/Layout'
import MangoProvider from '@components/MangoProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { notify } from 'utils/notifications'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AUTO_CONNECT_WALLET, THEME_KEY } from 'utils/constants'
import useLocalStorageState from 'hooks/useLocalStorageState'
import PlausibleProvider from 'next-plausible'

// init react-query
export const queryClient = new QueryClient()

const metaTitle = 'Boost!'
const metaDescription =
  'Earn boosted yield on JLP, mSOL, JitoSOL, bSOL and USDC. Powered by Mango'

// Do not add hooks to this component, that will cause unnecessary rerenders
// Top level state hydrating/updating should go in MangoProvider
function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const router = useRouter()
  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
      new BraveWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new CloverWalletAdapter(),
      new LedgerWalletAdapter(),
      new ExodusWalletAdapter(),
      new WalletConnectWalletAdapter({ network, options: {} }),
    ]
  }, [network])

  const onError = useCallback((error: WalletError, adapter?: Adapter) => {
    console.error(error, adapter)
    if (error instanceof WalletNotReadyError && adapter) {
      notify({
        title: `${adapter.name} Error`,
        type: 'error',
        description: `Please install ${adapter.name} and then reload this page.`,
      })
      if (typeof window !== 'undefined') {
        window.open(adapter.url, '_blank')
      }
    } else {
      notify({
        title: `${adapter?.name} ${error.error?.message || 'Error'}`,
        type: 'info',
      })
    }
  }, [])

  const [autoConnectSetting] = useLocalStorageState(AUTO_CONNECT_WALLET, true)
  const autoConnect =
    autoConnectSetting === false || router.asPath.includes('?address')
      ? false
      : true

  return (
    <>
      <Head>
        <title>Boost!</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/apple-touch-icon.png"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta
          name="twitter:image"
          content="https://boost.mango.markets/images/1200x675-share.png?345678790"
        />
        <meta name="google" content="notranslate" />
        <link rel="manifest" href="/manifest.json"></link>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider
            wallets={wallets}
            onError={onError}
            autoConnect={autoConnect}
          >
            <MangoProvider />
            <ThemeProvider defaultTheme="Light" storageKey={THEME_KEY}>
              <Telemetry />
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <TransactionNotification />
            </ThemeProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </>
  )
}

export default appWithTranslation(MyApp)

type TelemetryProps = {
  walletProvider: string | WalletName<string>
  walletConnected: string
}

const Telemetry = () => {
  const { wallet } = useWallet()
  const [telemetryProps, setTelemetryProps] = useState<
    TelemetryProps | undefined
  >()

  useEffect(() => {
    const props = {
      walletProvider: wallet?.adapter.name ?? 'unknown',
      walletConnected: (wallet?.adapter.connected ?? 'false').toString(),
    }

    // Hack to update script tag
    const el = document.getElementById('plausible')
    if (el) {
      Object.entries(props).forEach(([key, value]) => {
        el.setAttribute(`event-${key}`, value)
      })
    }
    setTelemetryProps(props)
  }, [wallet])

  return (
    <PlausibleProvider
      domain="boost.mango.markets"
      customDomain="https://pl.mngo.cloud"
      trackLocalhost={true}
      selfHosted={true}
      scriptProps={{ id: 'plausible' }}
      pageviewProps={telemetryProps}
      trackOutboundLinks={true}
    />
  )
}
