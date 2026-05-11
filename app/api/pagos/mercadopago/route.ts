import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.jpjeansvip.com/api';

export async function POST(request: Request) {
  try {
    const { cart, email, codigoDescuento } = await request.json();

    // 1. OBTENEMOS EL CATÁLOGO REAL DEL SERVIDOR
    const resCatalogo = await fetch(`${BASE_URL}/web/catalogo`);
    const dataCatalogo = await resCatalogo.json();
    const catalogoReal = dataCatalogo.productos || [];

    // 2. RECALCULAMOS EL PRECIO SEGURO Y REAL
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

    // 3. VALIDAMOS EL CUPÓN EN LA BASE DE DATOS
    if (codigoDescuento) {
      const resCupon = await fetch(`${BASE_URL}/cupones/validar/${codigoDescuento}`);
      const dataCupon = await resCupon.json();
      if (dataCupon.valido) {
        // En tu lógica POS el descuento es por pieza
        const descuentoTotal = parseFloat(dataCupon.descuento) * totalPiezas;
        totalReal = totalReal - descuentoTotal;
      }
    }

    if (totalReal < 0) totalReal = 0;

    // 4. CREAMOS EL TICKET DE OXXO EN MERCADO PAGO DIRECTAMENTE
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        transaction_amount: Number(totalReal.toFixed(2)), // Redondeo por seguridad financiera
        description: "Compra en Tienda Web JP Jeans",
        payment_method_id: "oxxo",
        payer: { email: email }
      })
    });

    const dataMP = await response.json();

    // 5. DEVOLVEMOS LA URL DEL RECIBO Y EL ID AL CHECKOUT
    if (dataMP.status === "pending" && dataMP.transaction_details?.external_resource_url) {
      return NextResponse.json({
        ticketUrl: dataMP.transaction_details.external_resource_url,
        id: dataMP.id.toString() // 🚨 CRÍTICO PARA QUE EL WEBHOOK DE TU SERVIDOR LO RECONOZCA
      });
    } else {
      console.error("Error MP:", dataMP);
      return NextResponse.json({ error: 'Error generando el ticket en Mercado Pago' }, { status: 400 });
    }

  } catch (error) {
    console.error("Error en Ruta Mercado Pago:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
