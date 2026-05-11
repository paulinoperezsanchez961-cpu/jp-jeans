import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.jpjeansvip.com/api';
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API_URL = "https://api-m.paypal.com"; // Cambiar a api-m.sandbox.paypal.com si es de prueba

async function generarTokenAcceso() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { cart, codigoDescuento } = await request.json();

    // 1. OBTENEMOS EL CATÁLOGO REAL DEL SERVIDOR
    const resCatalogo = await fetch(`${BASE_URL}/web/catalogo`);
    const dataCatalogo = await resCatalogo.json();
    const catalogoReal = dataCatalogo.productos || [];

    // 2. RECALCULAMOS EL PRECIO SEGURO
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

    if (totalReal === 0) return NextResponse.json({ error: 'Carrito inválido' }, { status: 400 });

    // 3. VALIDAMOS EL CUPÓN EN BD
    if (codigoDescuento) {
      const resCupon = await fetch(`${BASE_URL}/cupones/validar/${codigoDescuento}`);
      const dataCupon = await resCupon.json();
      if (dataCupon.valido) {
        const descuentoTotal = parseFloat(dataCupon.descuento) * totalPiezas;
        totalReal = totalReal - descuentoTotal;
      }
    }

    if (totalReal < 0) totalReal = 0;
    const totalFormateado = totalReal.toFixed(2);

    const accessToken = await generarTokenAcceso();
    const paypalResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'MXN', value: totalFormateado } }],
      }),
    });

    const orden = await paypalResponse.json();
    return NextResponse.json({ id: orden.id });

  } catch (error) {
    console.error("Error PayPal:", error);
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 });
  }
}