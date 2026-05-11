import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const BASE_URL = 'https://api.jpjeansvip.com/api';

export async function POST(request: Request) {
  try {
    const { cart, codigoDescuento } = await request.json();

    // 1. OBTENEMOS EL CATÁLOGO REAL DEL SERVIDOR
    const resCatalogo = await fetch(`${BASE_URL}/web/catalogo`);
    const dataCatalogo = await resCatalogo.json();
    const catalogoReal = dataCatalogo.productos || [];

    // 2. RECALCULAMOS EL PRECIO REAL Y SEGURO
    let totalReal = 0;
    let totalPiezas = 0;

    cart.forEach((itemCliente: any) => {
      const productoReal = catalogoReal.find((p: any) => p.id === itemCliente.id);
      if (productoReal) {
        const precioUsar = productoReal.en_rebaja === 1 ? parseFloat(productoReal.precio_rebaja) : parseFloat(productoReal.precio_venta);
        totalReal += precioUsar * itemCliente.cantidad;
        totalPiezas += itemCliente.cantidad;
      }
    });

    if (totalReal === 0) return NextResponse.json({ error: 'Carrito inválido o vacío' }, { status: 400 });

    // 3. VALIDAMOS EL CUPÓN REAL EN LA BASE DE DATOS
    if (codigoDescuento) {
      const resCupon = await fetch(`${BASE_URL}/cupones/validar/${codigoDescuento}`);
      const dataCupon = await resCupon.json();
      
      if (dataCupon.valido) {
        const descuentoPorPieza = parseFloat(dataCupon.descuento);
        const descuentoTotal = descuentoPorPieza * totalPiezas;
        totalReal = totalReal - descuentoTotal;
      }
    }

    if (totalReal < 0) totalReal = 0;

    // 4. STRIPE COBRA EN CENTAVOS
    const montoEnCentavos = Math.round(totalReal * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: montoEnCentavos,
      currency: 'mxn',
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Error Stripe:", error);
    return NextResponse.json({ error: 'Error procesando el cobro seguro' }, { status: 500 });
  }
}