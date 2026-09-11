import { NextResponse } from 'next/server';
import { verifyRazorpayPayment } from '@/lib/razorpay';

export async function POST(request: Request) {
  const { orderId, paymentId, signature } = await request.json();
  if (!verifyRazorpayPayment(orderId, paymentId, signature)) return NextResponse.json({ success: false, error: 'invalid_signature' }, { status: 400 });
  // The webhook remains the activation authority; this only confirms the browser callback was authentic.
  return NextResponse.json({ success: true });
}
