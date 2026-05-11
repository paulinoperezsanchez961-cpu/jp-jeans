'use client';

import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

// 🚨 AQUÍ ESTÁ LA CORRECCIÓN: Declaramos que este componente recibe "clientSecret" y "onPagoExitoso"
export default function CheckoutForm({ 
  clientSecret, 
  onPagoExitoso 
}: { 
  clientSecret: string, 
  onPagoExitoso?: (id: string) => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Si Stripe no ha cargado o falta la llave del servidor, bloqueamos el intento
    if (!stripe || !elements || !clientSecret) return;

    setProcesando(true);
    setError(null); // Limpiamos errores previos
    
    const cardElement = elements.getElement(CardNumberElement);

    if (cardElement) {
      // 🔒 Confirmamos el pago cruzando la tarjeta con la intención de pago del backend.
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        // El banco rechazó la tarjeta, no tiene fondos o hubo un error de red
        setError(error.message || 'Ocurrió un error al procesar la tarjeta.');
        setProcesando(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 🚨 PAGO SEGURO Y EXITOSO: Disparamos la función que guarda la venta
        if (onPagoExitoso) {
          onPagoExitoso(paymentIntent.id);
        }
      }
    }
  };

  // Estilo minimalista para los 3 campos
  const ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '11px',
        color: '#ffffff',
        '::placeholder': { color: '#666666' },
        fontFamily: 'sans-serif',
        letterSpacing: '0.1em',
      },
      invalid: { color: '#ff3333' },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2 space-y-6">
      
      {/* Cajas de texto separadas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 border-b border-white/20 pb-2">
          <label className="block text-[8px] tracking-[0.2em] uppercase text-white/50 mb-3">Número de Tarjeta</label>
          <CardNumberElement options={ELEMENT_OPTIONS} className="p-2" />
        </div>
        
        <div className="col-span-1 border-b border-white/20 pb-2">
          <label className="block text-[8px] tracking-[0.2em] uppercase text-white/50 mb-3">Expiración (MM/AA)</label>
          <CardExpiryElement options={ELEMENT_OPTIONS} className="p-2" />
        </div>
        
        <div className="col-span-1 border-b border-white/20 pb-2">
          <label className="block text-[8px] tracking-[0.2em] uppercase text-white/50 mb-3">Código CVV</label>
          <CardCvcElement options={ELEMENT_OPTIONS} className="p-2" />
        </div>
      </div>

      {error && <div className="text-red-500 text-[9px] mt-2 tracking-widest uppercase">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || procesando}
        className="w-full bg-white text-black py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-gray-200 transition-all mt-8 disabled:opacity-50"
      >
        {procesando ? 'Procesando de forma segura...' : 'Pagar de forma segura'}
      </button>
    </form>
  );
}