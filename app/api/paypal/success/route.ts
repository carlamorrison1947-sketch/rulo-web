// app/api/paypal/success/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const PAYPAL_API = process.env.PAYPAL_MODE === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token'); // Este es el order ID

    if (!token) {
      return NextResponse.redirect(
        new URL('/showcase?error=missing_token', req.url)
      );
    }

    // Obtener access token
    const accessToken = await getPayPalAccessToken();

    // Capturar el pago automáticamente
    const captureResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await captureResponse.json();

    console.log('PayPal Capture Response:', captureData);

    if (captureData.status === 'COMPLETED') {
      // Extraer información del custom_id
      const customId = captureData.purchase_units[0].payments.captures[0].custom_id;
      const [userId, packageId, solcitos] = customId.split('|');

      // Buscar usuario en DB por Clerk ID
      const user = await db.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        console.error('Usuario no encontrado:', userId);
        return NextResponse.redirect(
          new URL('/showcase?error=user_not_found', req.url)
        );
      }

      // Acreditar Solcitos al usuario
      await db.user.update({
        where: { id: userId },
        data: {
          solcitosBalance: {
            increment: parseInt(solcitos),
          },
        },
      });

      // Registrar la transacción
      await db.solcitoTransaction.create({
        data: {
          senderId: userId,
          receiverId: userId,
          amount: parseInt(solcitos),
          type: 'PURCHASE',
          paymentMethod: 'PAYPAL',
          paymentId: captureData.id,
        },
      });

      console.log(`✅ Pago completado: ${solcitos} Solcitos para ${user.username}`);

      return NextResponse.redirect(
        new URL(`/showcase?success=true&solcitos=${solcitos}`, req.url)
      );
    } else {
      console.error('Pago no completado:', captureData);
      return NextResponse.redirect(
        new URL('/showcase?error=payment_not_completed', req.url)
      );
    }

  } catch (error) {
    console.error('Error en PayPal success:', error);
    return NextResponse.redirect(
      new URL('/showcase?error=server_error', req.url)
    );
  }
}