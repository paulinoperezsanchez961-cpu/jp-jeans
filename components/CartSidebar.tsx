'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay oscuro desenfocado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-100 backdrop-blur-sm cursor-pointer"
          />
          
          {/* Panel Lateral Desplegable */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'circOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black border-l border-white/10 z-110 flex flex-col text-white shadow-2xl"
          >
            {/* Encabezado de la bolsa */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-serif font-light text-xl tracking-[0.2em] uppercase">Tu Bolsa</h2>
              <button onClick={closeCart} className="text-white hover:opacity-70 transition-opacity">
                <svg className="w-6 h-6 font-thin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Contenido (Prendas) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 space-y-4">
                   <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                   <p className="font-sans font-thin text-xs tracking-[0.2em] uppercase">Tu bolsa está vacía.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-white/10 pb-6">
                    <div className="w-24 aspect-4/5 bg-white/5 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-sans font-light text-sm tracking-widest uppercase">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id, item.size)} className="text-white/50 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <p className="font-sans text-xs text-white/50 mt-1 uppercase tracking-widest">Talla: {item.size}</p>
                        <p className="font-sans text-xs text-white/50 mt-1 uppercase tracking-widest">Cant: {item.quantity}</p>
                      </div>
                      <p className="font-sans font-light text-sm tracking-widest">${item.price.toFixed(2)} MXN</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total y Proceder al Pago */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans font-light text-xs tracking-[0.2em] uppercase opacity-70">Subtotal</span>
                  <span className="font-sans font-light text-lg tracking-widest">${cartTotal.toFixed(2)} MXN</span>
                </div>
                <Link href="/checkout" onClick={closeCart} className="w-full block text-center bg-white text-black py-4 font-sans font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase hover:bg-white/80 transition-colors">
                  Proceder al Pago
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}