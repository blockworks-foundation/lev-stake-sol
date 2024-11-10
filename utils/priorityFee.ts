import { Dispatch, SetStateAction } from 'react'
import { PRIORITY_FEE_KEY } from './constants'
import { DEFAULT_PRIORITY_FEE_LEVEL } from '@components/settings/RpcSettings'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { LITE_RPC_URL } from '@store/mangoStore'

export const handleEstimateFeeWithWs = (
  setWs: Dispatch<SetStateAction<WebSocket | null>>,
  updateFee: (fee: number) => void,
) => {
  try {
    let ws: null | WebSocket = null
    let lastProcessedTime: null | number = null
    let lastFee: null | number = null
    let reportedUndefinedFeeCount = 0

    const wsUrl = new URL(LITE_RPC_URL.replace('https', 'wss'))
    ws = new WebSocket(wsUrl)

    ws.addEventListener('open', () => {
      try {
        console.log('Fee WebSocket opened')
        const message = JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'blockPrioritizationFeesSubscribe',
          interval: 30,
        })
        ws?.send(message)

        setWs(ws)
      } catch (e) {
        ws?.close(1000)
        throw e
      }
    })
    ws.addEventListener('close', () => {
      console.log('Fee WebSocket closed')
      setWs(null)
    })
    ws.addEventListener('error', () => {
      try {
        console.log('Fee WebSocket error')
        setWs(null)
      } catch (e) {
        console.log(e)
        throw e
      }
    })
    ws.addEventListener('message', function incoming(data: { data: string }) {
      try {
        const currentTime = Date.now()
        const priorityFeeMultiplier = Number(
          localStorage.getItem(PRIORITY_FEE_KEY) ??
            DEFAULT_PRIORITY_FEE_LEVEL.value,
        )

        if (reportedUndefinedFeeCount >= 5) {
          ws?.close(1000)
        }
        if (
          !lastFee ||
          !lastProcessedTime ||
          currentTime - lastProcessedTime >= 30000
        ) {
          const seventyFivePerc = JSON.parse(data.data)?.params?.result?.value
            ?.by_tx[18]

          if (seventyFivePerc === undefined) {
            reportedUndefinedFeeCount += 1
          } else {
            const feeEstimate = Math.max(
              Math.min(
                Math.ceil(seventyFivePerc * priorityFeeMultiplier),
                LAMPORTS_PER_SOL * 0.005,
              ),
              100000,
            )
            console.log(feeEstimate)
            updateFee(feeEstimate)
            lastFee = feeEstimate
            lastProcessedTime = currentTime
          }
        }
      } catch (e) {
        console.log(e)
        throw e
      }
    })
    return ws
  } catch (e) {
    console.log(e)
    setWs(null)
    throw e
  }
}
