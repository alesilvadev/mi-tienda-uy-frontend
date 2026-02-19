const STORAGE_KEY = 'mi_tienda_order'

export interface StoredOrder {
  orderId: string
  orderCode: string
  items: Array<{
    id: string
    sku: string
    name: string
    quantity: number
    price: number
    color?: string
    listType: 'buy' | 'wishlist'
  }>
  subtotal: number
  status: string
}

export const storage = {
  getOrder: (): StoredOrder | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  },

  setOrder: (order: StoredOrder) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  },

  clearOrder: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  },

  getCashierToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('cashier_token')
  },

  setCashierToken: (token: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('cashier_token', token)
  },

  clearCashierToken: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('cashier_token')
  },
}
