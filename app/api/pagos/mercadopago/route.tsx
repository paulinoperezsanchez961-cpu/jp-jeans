import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Tu Access Token de Producción
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const payment = new Payment(client);

// Simulamos tu BD
const baseDeDatos = [{ id: 'JD-001', precio: 2499.00 }];

export async function POST(request: Request) {
  try {
    // 1. Recibimos el carrito y el email del cliente (Mercado Pago pide el email para efectivo)
    const { cart, email } = await request.json();

    // 2. Calculamos el total real
    let totalReal = 0;
    cart.forEach((item: any) => {
      const dbItem = baseDeDatos.find(p => p.id === item.id);
      if (dbItem) totalReal += dbItem.precio * item.cantidad;
    });

    // 3. Generamos el ticket de pago en efectivo vía OXXO
    const response = await payment.create({
      body: {
        transaction_amount: totalReal,
        description: 'Compra en JP Jeans',
        payment_method_id: 'oxxo', // Aquí le decimos que es para OXXO
        payer: {
          email: email,
        },
      }
    });

    // 4. Mercado Pago nos devuelve una URL con el ticket generado
    const ticketUrl = response.transaction_details?.external_resource_url;

    return NextResponse.json({ ticketUrl });

  } catch (error) {
    return NextResponse.json({ error: 'Error generando referencia' }, { status: 500 });
  }
}

