import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel de Caja - Mi Tienda UY',
  description: 'Panel de caja para procesar pedidos',
}

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return children
}
