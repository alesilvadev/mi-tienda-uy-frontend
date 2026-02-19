import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Mi Tienda UY',
  description: 'Panel de administración',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
