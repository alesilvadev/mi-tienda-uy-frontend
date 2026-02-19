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
      setError(err instanceof Error ? err.message : 'Error loading products')
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
      setError(err instanceof Error ? err.message : 'Error creating product')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Gestión de Productos</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Salir
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 font-semibold hover:underline"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Nuevo Producto</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colores (separados por coma)
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Rojo, Azul, Verde"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Productos ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No hay productos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Colores
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{product.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
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
