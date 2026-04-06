'use client';

import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcesando(true);
    const cardElement = elements.getElement(CardNumberElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || 'Ocurrió un error con la tarjeta.');
        setProcesando(false);
      } else {
        console.log('Pago exitoso, ID:', paymentMethod.id);
        alert('¡Pago autorizado! El Cerebro registrará la venta.');
        setProcesando(false);
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
        {procesando ? 'Procesando...' : 'Pagar de forma segura'}
      </button>
    </form>
  );
}