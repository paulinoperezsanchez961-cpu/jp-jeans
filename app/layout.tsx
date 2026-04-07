import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import CartSidebar from '@/components/CartSidebar'
import { CartProvider } from '@/context/CartContext'

// IMPORTACIÓN DEL MOTOR DE SEGURIDAD Y USUARIOS
import { ClerkProvider } from '@clerk/nextjs'

// METADATOS LIMPIOS Y DIRECTOS
export const metadata: Metadata = {
  title: 'JP Jeans',
  description: 'Colección Exclusiva de Alta Costura y Streetwear.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ENVOLVEMOS LA APLICACIÓN COMPLETA PARA BLINDARLA
    <ClerkProvider>
      <html lang="es">
        <body className="bg-black text-white antialiased">
          
          <CartProvider>
            <Navbar />
            <CartSidebar />
            
            <main>
              {children}
            </main>
            
          </CartProvider>
          
        </body>
      </html>
    </ClerkProvider>
  )
}