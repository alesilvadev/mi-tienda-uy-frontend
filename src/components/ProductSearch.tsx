'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface Product {
  id: string
  sku: string
  name: string
  price: number
  description?: string
  image?: string
  colors?: string[]
}

interface ProductSearchProps {
  onProductFound: (product: Product) => void
  onError: (error: string) => void
}

export default function ProductSearch({ onProductFound, onError }: ProductSearchProps) {
  const [sku, setSku] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sku.trim()) return

    setLoading(true)
    try {
      const product = await api.searchProduct(sku)
      onProductFound(product)
      setSku('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Product not found'
      onError(message)
      setSku('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value.toUpperCase())}
          placeholder="Ingresa código del producto"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500"
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !sku.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </form>
  )
}
