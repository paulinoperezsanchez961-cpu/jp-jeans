'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// Tu llave pública de Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
const BASE_URL = 'https://api.jpjeansvip.com/api';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  
  const [paso, setPaso] = useState<1 | 2>(1); 
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'oxxo' | 'paypal'>('tarjeta');

  const [datosEnvio, setDatosEnvio] = useState({
    email: '', nombre: '', telefono: '', calle: '', numero: '', colonia: '', cp: '', ciudad: '', estado: ''
  });

  // ESTADOS DEL SISTEMA DE DESCUENTOS REAL (Conectado a la BD)
  const [codigoInput, setCodigoInput] = useState('');
  const [codigoAplicado, setCodigoAplicado] = useState<string | null>(null);
  const [descuentoPorPieza, setDescuentoPorPieza] = useState(0);
  const [errorCodigo, setErrorCodigo] = useState('');

  // ESTADOS DE SEGURIDAD PARA STRIPE Y OXXO
  const [clientSecret, setClientSecret] = useState('');
  const [ticketOxxo, setTicketOxxo] = useState('');
  const [cargandoOxxo, setCargandoOxxo] = useState(false);

  // LÓGICA MATEMÁTICA DE PRECIOS
  const totalOriginal = getCartTotal();
  const totalPiezas = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const montoDescuento = descuentoPorPieza * totalPiezas;
  const totalFinal = Math.max(0, totalOriginal - montoDescuento);

  // 🚨 FUNCIÓN PARA GUARDAR EL PEDIDO EN BODEGA Y POS TRAS PAGAR
  const registrarPedidoFinal = async (metodo: string, idTransaccion: string) => {
    try {
      await fetch(`${BASE_URL}/web/crear-pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrito: cart,
          datosEnvio,
          metodo_pago: metodo,
          id_transaccion: idTransaccion,
          total: totalFinal,
          codigo_creador: codigoAplicado
        })
      });
      clearCart();
      window.location.href = '/novedades?exito=true'; 
    } catch (e) {
      console.error("Error guardando el pedido en el servidor");
    }
  };

  // 🚨 VALIDACIÓN REAL DE CUPONES CONTRA LA BASE DE DATOS
  const aplicarCodigo = async () => {
    setErrorCodigo('');
    const codigoFormateado = codigoInput.trim().toUpperCase();

    if (!codigoFormateado) {
      setErrorCodigo('Ingresa un código.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/cupones/validar/${codigoFormateado}`);
      const data = await res.json();

      if (data.valido) {
        setDescuentoPorPieza(parseFloat(data.descuento));
        setCodigoAplicado(codigoFormateado);
        setCodigoInput('');
      } else {
        setErrorCodigo('El código no existe o ha expirado.');
      }
    } catch (e) {
      setErrorCodigo('Error de conexión al validar código.');
    }
  };

  const removerCodigo = () => {
    setCodigoAplicado(null);
    setDescuentoPorPieza(0);
    setErrorCodigo('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
  };

  const handleContinuarPago = (e: React.FormEvent) => {
    e.preventDefault(); 
    setPaso(2);
  };

  const cargarStripe = async () => {
    try {
      const res = await fetch('/api/pagos/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, codigoDescuento: codigoAplicado })
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        alert("Error cargando Stripe: " + (data.error || "Desconocido"));
      }
    } catch (error) {
      console.error("Error al cargar Stripe", error);
    }
  };

  const generarTicketOxxo = async () => {
    setCargandoOxxo(true);
    try {
      const res = await fetch('/api/pagos/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, email: datosEnvio.email, codigoDescuento: codigoAplicado })
      });
      const data = await res.json();
      if (data.ticketUrl) {
        setTicketOxxo(data.ticketUrl);
        registrarPedidoFinal('OXXO Pendiente', 'Ticket Generado');
      } else {
        alert("Error generando ticket: " + (data.error || "Desconocido"));
      }
    } catch (error) {
      console.error("Error Mercado Pago", error);
    } finally {
      setCargandoOxxo(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* COLUMNA IZQUIERDA: FLUJO DE PASOS */}
        <div className="lg:col-span-7 space-y-12">
          
          <div className="flex gap-4 border-b border-white/10 pb-6">
            <button onClick={() => setPaso(1)} className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${paso === 1 ? 'text-white font-bold' : 'text-white/40 hover:text-white'}`}>
              1. Datos de Envío
            </button>
            <span className="text-white/20">{'>'}</span>
            <span className={`text-[10px] tracking-[0.2em] uppercase ${paso === 2 ? 'text-white font-bold' : 'text-white/40'}`}>
              2. Pago Seguro
            </span>
          </div>

          {/* ================= PASO 1: DATOS DE ENVÍO ================= */}
          {paso === 1 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="font-serif text-2xl tracking-[0.2em] uppercase mb-8">Información de Entrega</h2>
              
              <form className="grid grid-cols-2 gap-x-6 gap-y-8" onSubmit={handleContinuarPago}>
                <div className="col-span-2">
                  <input type="email" name="email" value={datosEnvio.email} onChange={handleInputChange} placeholder="CORREO ELECTRÓNICO" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest normal-case focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <input type="text" name="nombre" value={datosEnvio.nombre} onChange={handleInputChange} placeholder="NOMBRE COMPLETO" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2">
                  <input type="tel" name="telefono" value={datosEnvio.telefono} onChange={handleInputChange} placeholder="TELÉFONO (10 DÍGITOS)" required minLength={10} maxLength={10} className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                
                <div className="col-span-2 pt-4">
                  <h3 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-4">Dirección</h3>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <input type="text" name="calle" value={datosEnvio.calle} onChange={handleInputChange} placeholder="CALLE" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" name="numero" value={datosEnvio.numero} onChange={handleInputChange} placeholder="NÚMERO EXT / INT" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" name="colonia" value={datosEnvio.colonia} onChange={handleInputChange} placeholder="COLONIA" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" name="cp" value={datosEnvio.cp} onChange={handleInputChange} placeholder="CÓDIGO POSTAL" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" name="ciudad" value={datosEnvio.ciudad} onChange={handleInputChange} placeholder="CIUDAD" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <input type="text" name="estado" value={datosEnvio.estado} onChange={handleInputChange} placeholder="ESTADO" required className="w-full bg-transparent border-b border-white/20 p-3 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" />
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
                <button onClick={() => setMetodoPago('tarjeta')} className={`flex-1 py-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${metodoPago === 'tarjeta' ? 'bg-white text-black border-white' : 'border-white/20 opacity-50 hover:border-white/50'}`}>
                  Tarjeta
                </button>
                <button onClick={() => setMetodoPago('oxxo')} className={`flex-1 py-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${metodoPago === 'oxxo' ? 'bg-white text-black border-white' : 'border-white/20 opacity-50 hover:border-white/50'}`}>
                  OXXO (Efectivo)
                </button>
                <button onClick={() => setMetodoPago('paypal')} className={`flex-1 py-4 border text-[9px] tracking-[0.2em] uppercase transition-all ${metodoPago === 'paypal' ? 'bg-white text-black border-white' : 'border-white/20 opacity-50 hover:border-white/50'}`}>
                  PayPal
                </button>
              </div>

              <div className="min-h-[250px] bg-white/5 p-8 md:p-10 border border-white/10">
                
                {metodoPago === 'tarjeta' && (
                  <div className="animate-in fade-in duration-500">
                    <p className="text-[9px] tracking-widest opacity-50 mb-8 uppercase border-b border-white/10 pb-4">Conexión cifrada a través de Stripe</p>
                    {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                        {/* 🚨 AQUÍ ESTÁ EL TIPO EXACTO QUE ARREGLA EL ERROR */}
                        <CheckoutForm clientSecret={clientSecret} onPagoExitoso={(id: string) => registrarPedidoFinal('Stripe - Tarjeta Web', id)} />
                      </Elements>
                    ) : (
                      <button onClick={cargarStripe} className="w-full bg-white text-black py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200 transition-colors">
                        Cargar Formulario Seguro
                      </button>
                    )}
                  </div>
                )}

                {metodoPago === 'oxxo' && (
                  <div className="text-center py-6 animate-in fade-in duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Oxxo_Logo.svg" alt="OXXO" className="h-10 mx-auto mb-6 grayscale invert opacity-80" />
                    {ticketOxxo ? (
                      <div className="space-y-6">
                        <p className="text-[10px] text-green-400 tracking-widest uppercase">¡Referencia generada con éxito!</p>
                        <a href={ticketOxxo} target="_blank" rel="noreferrer" className="inline-block w-full bg-white text-black py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200">
                          Imprimir / Ver Código
                        </a>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] tracking-widest uppercase leading-loose opacity-70 max-w-md mx-auto">
                          Generaremos una referencia de pago segura. Podrás pagar en efectivo en cualquier sucursal OXXO o usar tu app Spin by OXXO.
                        </p>
                        <button onClick={generarTicketOxxo} disabled={cargandoOxxo} className="mt-10 w-full bg-white text-black py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-200 disabled:opacity-50 transition-colors">
                          {cargandoOxxo ? 'Generando...' : 'Generar Referencia de Pago'}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {metodoPago === 'paypal' && (
                  <div className="animate-in fade-in duration-500 pt-4">
                     <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "MXN" }}>
                        <PayPalButtons 
                          style={{ layout: "vertical", color: "white", shape: "rect", label: "pay" }} 
                          createOrder={async () => {
                            const res = await fetch('/api/pagos/paypal', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ cart: cart, codigoDescuento: codigoAplicado }) 
                            });
                            const ordenSegura = await res.json();
                            return ordenSegura.id;
                          }}
                          onApprove={async (data, actions) => {
                             if (actions.order) {
                               const details = await actions.order.capture();
                               alert("Pago verificado y completado por " + details?.payer?.name?.given_name);
                               registrarPedidoFinal('PayPal Web', details.id || 'N/A');
                             }
                          }}
                        />
                     </PayPalScriptProvider>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE COMPRA */}
        <aside className="lg:col-span-5 h-fit lg:sticky lg:top-32">
          <div className="bg-white/5 p-8 border border-white/10">
            <h3 className="font-serif text-xl tracking-[0.2em] uppercase mb-8 border-b border-white/10 pb-4">Tu Pedido</h3>
            
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

            {/* ========================================================= */}
            {/* SISTEMA DE CÓDIGO DE DESCUENTO UNIFICADO */}
            {/* ========================================================= */}
            <div className="border-t border-white/20 pt-6 pb-6 space-y-4">
              {!codigoAplicado ? (
                <div>
                  <label className="text-[9px] tracking-[0.2em] uppercase text-white/50 mb-3 block">¿Tienes un código de creador?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={codigoInput} 
                      onChange={(e) => setCodigoInput(e.target.value)} 
                      placeholder="INGRESA TU CÓDIGO" 
                      className="w-full bg-transparent border-b border-white/20 p-2 text-[10px] tracking-widest uppercase focus:border-white outline-none transition-colors" 
                    />
                    <button 
                      onClick={aplicarCodigo} 
                      className="px-6 bg-white text-black text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {errorCodigo && <p className="text-red-500 text-[9px] tracking-widest uppercase mt-3">{errorCodigo}</p>}
                </div>
              ) : (
                <div className="bg-white/5 p-4 flex justify-between items-center border border-white/10">
                  <div>
                    <p className="text-[8px] text-green-400 tracking-widest uppercase mb-1">Código Aplicado Exitosamente</p>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase">{codigoAplicado} <span className="font-light text-white/50">(-${descuentoPorPieza} x pz)</span></p>
                  </div>
                  <button onClick={removerCodigo} className="text-white/40 hover:text-white text-[9px] tracking-widest uppercase transition-colors border-b border-transparent hover:border-white pb-0.5">
                    Quitar
                  </button>
                </div>
              )}
            </div>
            {/* ========================================================= */}

            <div className="border-t border-white/20 pt-6 space-y-4">
              <div className="flex justify-between text-[10px] tracking-widest uppercase opacity-70">
                <span>Subtotal</span>
                <span className={descuentoPorPieza > 0 ? "line-through opacity-50" : ""}>
                  ${totalOriginal.toLocaleString('es-MX')} MXN
                </span>
              </div>
              
              {descuentoPorPieza > 0 && (
                <div className="flex justify-between text-[10px] tracking-widest uppercase text-green-400">
                  <span>Descuento ({codigoAplicado})</span>
                  <span>-${montoDescuento.toLocaleString('es-MX')} MXN</span>
                </div>
              )}

              <div className="flex justify-between text-[10px] tracking-widest uppercase opacity-70">
                <span>Envío (Express)</span>
                <span className="text-white font-bold">GRATIS</span>
              </div>
              
              <div className="flex justify-between items-end pt-4 mt-4 border-t border-white/10">
                <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">Total Final</span>
                <span className="text-2xl font-light tracking-widest">${totalFinal.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
            
          </div>
        </aside>

      </div>
    </div>
  );
}