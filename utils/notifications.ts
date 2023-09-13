import mangoStore from '@store/mangoStore'

export type TransactionNotification = {
  type: 'success' | 'info' | 'error' | 'confirm'
  title: string
  description?: null | string
  txid?: string
  show: boolean
  id: number
}

export function notify(newNotification: {
  type?: 'success' | 'info' | 'error' | 'confirm'
  title: string
  description?: string
  txid?: string
  noSound?: boolean
}) {
  const setMangoStore = mangoStore.getState().set
  const notifications = mangoStore.getState().transactionNotifications
  const lastId = mangoStore.getState().transactionNotificationIdCounter
  const newId = lastId + 1

  const newNotif: TransactionNotification = {
    id: newId,
    type: 'success',
    show: true,
    description: null,
    ...newNotification,
  }

  setMangoStore((state) => {
    state.transactionNotificationIdCounter = newId
    state.transactionNotifications = [...notifications, newNotif]
  })
}
