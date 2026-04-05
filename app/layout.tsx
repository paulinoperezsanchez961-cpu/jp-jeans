import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import CartSidebar from '@/components/CartSidebar'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'JP Jeans VIP',
  description: 'Colección Exclusiva de Alta Costura',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}