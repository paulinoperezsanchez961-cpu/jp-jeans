import { NextResponse } from 'next/server';

// Simulación de tu Base de Datos (Segura en el servidor)
const baseDeDatos = [
  { id: 'JD-001', precio: 2499.00 },
  { id: 'J-02', precio: 2799.00 },
  { id: 'J-03', precio: 2199.00 },
  // ... el resto de tus productos
];

// Credenciales privadas (Vienen de tu archivo .env.local)
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API_URL = "https://api-m.paypal.com"; // Usa "https://api-m.sandbox.paypal.com" para pruebas

// Función para obtener el Token de acceso seguro de PayPal
async function generarTokenAcceso() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    // 1. Recibimos SOLO qué quiere comprar el cliente (IDs y cantidades)
    const { cart } = await request.json();

    // 2. RECALCULAMOS el precio total leyendo la base de datos (Ignoramos el precio del frontend)
    let totalReal = 0;
    cart.forEach((itemCliente: any) => {
      const productoReal = baseDeDatos.find(p => p.id === itemCliente.id);
      if (productoReal) {
        totalReal += productoReal.precio * itemCliente.cantidad;
      }
    });

    // Validamos que el carrito no esté vacío o manipulado con IDs falsos
    if (totalReal === 0) {
      return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });
    }

    // 3. Generamos la orden directamente con PayPal desde el servidor
    const accessToken = await generarTokenAcceso();
    const paypalResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'MXN',
              value: totalReal.toString(), // Este valor es 100% seguro
            },
          },
        ],
      }),
    });

    const orden = await paypalResponse.json();

    // 4. Le devolvemos al frontend ÚNICAMENTE el ID seguro de la orden
    return NextResponse.json({ id: orden.id });

  } catch (error) {
    console.error("Error crítico en pago:", error);
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 });
  }
}