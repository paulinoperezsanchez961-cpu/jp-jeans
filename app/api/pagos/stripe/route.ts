import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Tu llave secreta de Stripe (la que empieza con sk_live_...)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Simulamos tu BD segura
const baseDeDatos = [
  { id: 'JD-001', precio: 2499.00 },
  { id: 'J-02', precio: 2799.00 },
];

export async function POST(request: Request) {
  try {
    // 1. AHORA TAMBIÉN RECIBIMOS EL CÓDIGO DE DESCUENTO
    const { cart, codigoDescuento } = await request.json();

    // 2. Recalculamos el precio original en el servidor
    let totalReal = 0;
    cart.forEach((itemCliente: any) => {
      const productoReal = baseDeDatos.find(p => p.id === itemCliente.id);
      if (productoReal) totalReal += productoReal.precio * itemCliente.cantidad;
    });

    if (totalReal === 0) return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });

    // 3. APLICAMOS EL DESCUENTO DE MANERA SEGURA
    if (codigoDescuento === 'ZERO30') {
      totalReal = totalReal * 0.70; // 30% de descuento
    } else if (codigoDescuento === 'VIP15') {
      totalReal = totalReal * 0.85; // 15% de descuento
    }

    // 4. Stripe cobra en CENTAVOS. Multiplicamos por 100 el total ya con descuento.
    const montoEnCentavos = Math.round(totalReal * 100);

    // 5. Creamos la Intención de Pago segura en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: montoEnCentavos,
      currency: 'mxn',
    });

    // 6. Devolvemos la llave
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    return NextResponse.json({ error: 'Error con Stripe' }, { status: 500 });
  }
}