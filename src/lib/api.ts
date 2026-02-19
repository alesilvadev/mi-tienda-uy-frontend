const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Product {
  id: string
  sku: string
  name: string
  price: number
  description?: string
  image?: string
  colors?: string[]
}

interface CartItem {
  sku: string
  quantity: number
  color?: string
}

interface OrderItem extends CartItem {
  id: string
  name: string
  price: number
  listType: 'buy' | 'wishlist'
}

interface Order {
  id: string
  orderId?: string
  orderCode: string
  status: string
  items: OrderItem[]
  subtotal: number
  total?: number
  createdAt?: string
  closedAt?: string
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

export const api = {
  searchProduct: (sku: string) =>
    request<Product>('GET', `/api/products/search?sku=${encodeURIComponent(sku)}`),

  getProduct: (id: string) =>
    request<Product>('GET', `/api/products/${id}`),

  createOrder: (listType?: 'buy' | 'wishlist') =>
    request<Order>('POST', '/api/orders', { listType }),

  addItem: (orderId: string, sku: string, quantity: number, color?: string) =>
    request<{ message: string; item: OrderItem }>(
      'POST',
      `/api/orders/${orderId}/items`,
      { sku, quantity, color }
    ),

  getOrder: (orderId: string) =>
    request<Order>('GET', `/api/orders/${orderId}`),

  updateItem: (orderId: string, itemIndex: number, quantity?: number, listType?: 'buy' | 'wishlist') =>
    request<{ message: string }>('PUT', `/api/orders/${orderId}/items/${itemIndex}`, {
      quantity,
      listType,
    }),

  removeItem: (orderId: string, itemIndex: number) =>
    request<{ message: string }>('DELETE', `/api/orders/${orderId}/items/${itemIndex}`),

  closeOrder: (orderId: string) =>
    request<{ message: string }>('POST', `/api/orders/${orderId}/close`),

  cashierLogin: (email: string, password: string) =>
    request<{ token: string }>('POST', '/api/auth/login', { email, password }),

  getOrderByCode: (orderCode: string, token: string) =>
    request<Order>('GET', `/api/orders/code/${orderCode}`, undefined, token),

  updateOrderStatus: (orderId: string, status: string, token: string) =>
    request<{ message: string; status: string }>(
      'PUT',
      `/api/orders/${orderId}/status`,
      { status },
      token
    ),

  createProduct: (product: Partial<Product>, token: string) =>
    request<Product>('POST', '/api/admin/products', product, token),

  updateProduct: (productId: string, updates: Partial<Product>, token: string) =>
    request<{ message: string }>('PUT', `/api/admin/products/${productId}`, updates, token),

  importProducts: (products: Partial<Product>[], token: string) =>
    request<{ imported: number }>('POST', '/api/admin/products/import', { products }, token),

  getProducts: (token: string) =>
    request<{ products: Product[] }>('GET', '/api/admin/products', undefined, token),

  health: () =>
    request<{ status: string }>('GET', '/health'),
}
