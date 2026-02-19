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
      const message = err instanceof Error ? err.message : 'Producto no encontrado'
      onError(message)
      setSku('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar Producto por Código</label>
      <div className="flex gap-3">
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value.toUpperCase())}
          placeholder="Ej: SKU001"
          className="flex-1 px-4 py-3 text-base font-medium border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !sku.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </form>
  )
}
