import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Tu Access Token de Producción
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const payment = new Payment(client);

// Simulamos tu BD
const baseDeDatos = [{ id: 'JD-001', precio: 2499.00 }];

export async function POST(request: Request) {
  try {
    // 1. Recibimos el carrito, email Y EL CÓDIGO DE DESCUENTO
    const { cart, email, codigoDescuento } = await request.json();

    // 2. Calculamos el total real sumando la base de datos
    let totalReal = 0;
    cart.forEach((item: any) => {
      const dbItem = baseDeDatos.find(p => p.id === item.id);
      if (dbItem) totalReal += dbItem.precio * item.cantidad;
    });

    // 3. APLICAMOS EL DESCUENTO DE MANERA SEGURA EN EL SERVIDOR
    if (codigoDescuento === 'ZERO30') {
      totalReal = totalReal * 0.70; // 30% de descuento
    } else if (codigoDescuento === 'VIP15') {
      totalReal = totalReal * 0.85; // 15% de descuento
    }

    // 4. Generamos el ticket de pago en efectivo vía OXXO
    const response = await payment.create({
      body: {
        transaction_amount: Number(totalReal.toFixed(2)), // Redondeamos a 2 decimales por seguridad
        description: 'Compra en JP Jeans',
        payment_method_id: 'oxxo', 
        payer: {
          email: email,
        },
      }
    });

    // 5. Devolvemos la URL
    const ticketUrl = response.transaction_details?.external_resource_url;
    return NextResponse.json({ ticketUrl });

  } catch (error) {
    return NextResponse.json({ error: 'Error generando referencia' }, { status: 500 });
  }
}
