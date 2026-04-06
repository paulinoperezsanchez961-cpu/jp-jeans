'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Tu llave de Stripe (Asegúrate de que siga en tu archivo .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  
  // Controles de la página
  const [paso, setPaso] = useState<1 | 2>(1); // 1 = Envío, 2 = Pago
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'oxxo' | 'paypal'>('tarjeta');

  const total = getCartTotal();

  return (
    <div className="bg-black min-h-screen text-white pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* COLUMNA IZQUIERDA: FLUJO DE PASOS (Ocupa 7 de 12 columnas) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Indicador de progreso */}
          <div className="flex gap-4 border-b border-white/10 pb-6">
            <button 
              onClick={() => setPaso(1)} 
              className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${paso === 1 ? 'text-white font-bold' : 'text-white/40 hover:text-white'}`}
            >
              1. Datos de Envío
            </button>
            <span className="text-white/20">{'>'}</span>
            <span className={`text-[10px] tracking-[0.2em] uppercase ${paso === 2 ? 'text-white font-bold' : 'text-white/40'}`}>
              2. Pago Seguros
            </span>
          </div>

          {/* ================= PASO 1: DATOS DE ENVÍO ================= */}
          {paso === 1 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-serif text-2xl tracking-[0.2em] uppercase mb-8">Información de Entrega</h2>
              
              <form 
                className="grid grid-cols-2 gap-x-6 gap-y-8"
                onSubmit={(e) => { e.preventDefault(); setPaso(2); }}
              >
                <div className="col-span-2">
                  <input type="email" placeholder="CORREO ELECTRÓNICO" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <input type="text" placeholder="NOMBRE COMPLETO" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <input type="tel" placeholder="TELÉFONO (10 DÍGITOS)" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                
                <div className="col-span-2 pt-4">
                  <h3 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-4">Dirección</h3>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <input type="text" placeholder="CALLE" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" placeholder="NÚMERO EXT / INT" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" placeholder="COLONIA" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" placeholder="CÓDIGO POSTAL" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" placeholder="CIUDAD" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" placeholder="ESTADO" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>

                <div className="col-span-2 mt-8">
                  <button type="submit" className="w-full bg-white text-black py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200 transition-colors">
                    Continuar al Pago
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ================= PASO 2: MÉTODOS DE PAGO ================= */}
          {paso === 2 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-serif text-2xl tracking-[0.2em] uppercase mb-8">Método de Pago</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setMetodoPago('tarjeta')}
                  className={`flex-1 py-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${metodoPago === 'tarjeta' ? 'bg-white text-black border-white' : 'border-white/20 opacity-50 hover:border-white/50'}`}
                >
                  Tarjeta de Crédito / Débito
                </button>
                <button 
                  onClick={() => setMetodoPago('oxxo')}
                  className={`flex-1 py-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${metodoPago === 'oxxo' ? 'bg-white text-black border-white' : 'border-white/20 opacity-50 hover:border-white/50'}`}
                >
                  Efectivo (OXXO)
                </button>
                <button 
                  onClick={() => setMetodoPago('paypal')}
                  className={`flex-1 py-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${metodoPago === 'paypal' ? 'bg-white text-black border-white' : 'border-white/20 opacity-50 hover:border-white/50'}`}
                >
                  PayPal
                </button>
              </div>

              <div className="min-h-[250px] bg-white/5 p-8 md:p-10 border border-white/10">
                
                {metodoPago === 'tarjeta' && (
                  <div className="animate-in fade-in duration-500">
                    <p className="text-[9px] tracking-widest opacity-50 mb-8 uppercase border-b border-white/10 pb-4">Conexión cifrada a través de Stripe</p>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm />
                    </Elements>
                  </div>
                )}

                {metodoPago === 'oxxo' && (
                  <div className="text-center py-6 animate-in fade-in duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Oxxo_Logo.svg" alt="OXXO" className="h-10 mx-auto mb-6 grayscale invert opacity-80" />
                    <p className="text-[10px] tracking-widest uppercase leading-loose opacity-70 max-w-md mx-auto">
                      Generaremos una referencia de pago segura. Podrás pagar en efectivo en cualquier sucursal OXXO o usar tu app Spin by OXXO.
                    </p>
                    <button className="mt-10 w-full bg-white text-black py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200">
                      Generar Referencia de Pago
                    </button>
                  </div>
                )}

                {metodoPago === 'paypal' && (
                  <div className="animate-in fade-in duration-500 pt-4">
                     {/* Solución del error: Se usa "test" temporalmente y se agregó la moneda */}
                     <PayPalScriptProvider options={{ clientId: "test", currency: "MXN" }}>
                        <PayPalButtons 
                          style={{ layout: "vertical", color: "white", shape: "rect", label: "pay" }} 
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [{ amount: { currency_code: "MXN", value: total.toString() } }]
                            });
                          }}
                        />
                     </PayPalScriptProvider>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

        {/* COLUMNA DERECHA: RESUMEN DE COMPRA (Ocupa 5 de 12 columnas) */}
        <aside className="lg:col-span-5 h-fit lg:sticky lg:top-32">
          <div className="bg-white/5 p-8 border border-white/10">
            <h3 className="font-serif text-xl tracking-[0.2em] uppercase mb-8 border-b border-white/10 pb-4">Tu Pedido</h3>
            
            {/* Lista de productos con imágenes */}
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto hide-scrollbar pr-2">
              {cart.map((item) => (
                <div key={`${item.id}-${item.talla}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-black/50 shrink-0 relative border border-white/10">
                    <img src={item.img} alt={item.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-[10px] tracking-widest uppercase">{item.nombre}</h4>
                    <p className="text-[9px] tracking-widest text-white/50 mt-1 uppercase">Talla: {item.talla} | Cant: {item.cantidad}</p>
                    <p className="text-[10px] tracking-widest mt-2">${(item.precio * item.cantidad).toLocaleString('es-MX')} MXN</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-6 space-y-4">
              <div className="flex justify-between text-[10px] tracking-widest uppercase opacity-70">
                <span>Subtotal</span>
                <span>${total.toLocaleString('es-MX')} MXN</span>
              </div>
              <div className="flex justify-between text-[10px] tracking-widest uppercase opacity-70">
                <span>Envío (Express)</span>
                <span className="text-white font-bold">GRATIS</span>
              </div>
              <div className="flex justify-between items-end pt-4 mt-4 border-t border-white/10">
                <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">Total</span>
                <span className="text-2xl font-light tracking-widest">${total.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}