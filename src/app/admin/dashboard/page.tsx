'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { storage } from '@/lib/storage'

interface Product {
  id: string
  sku: string
  name: string
  price: number
  description?: string
  colors?: string[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: '',
    description: '',
    colors: '',
  })

  useEffect(() => {
    const savedToken = storage.getCashierToken()
    if (!savedToken) {
      router.push('/admin/login')
    } else {
      setToken(savedToken)
      loadProducts(savedToken)
    }
  }, [router])

  const loadProducts = async (authToken: string) => {
    try {
      const result = await api.getProducts(authToken)
      setProducts(result.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando productos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    storage.clearCashierToken()
    router.push('/admin/login')
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    try {
      const newProduct = await api.createProduct(
        {
          sku: formData.sku,
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description || undefined,
          colors: formData.colors ? formData.colors.split(',').map((c) => c.trim()) : undefined,
        },
        token
      )

      setProducts([...products, newProduct])
      setFormData({ sku: '', name: '', price: '', description: '', colors: '' })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando producto')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-700 font-semibold">Cargando panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-indigo-600">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Gestión de Productos</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            Salir
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 text-sm space-y-2">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs font-semibold underline hover:no-underline"
            >
              Descartar
            </button>
          </div>
        )}

        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            {showForm ? 'Cancelar' : '➕ Agregar Producto'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Producto</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU001"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del producto"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del producto"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Colores (separados por coma)
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Rojo, Azul, Verde"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              Productos ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No hay productos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Precio</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Colores</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={product.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{product.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {product.colors?.join(', ') || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
