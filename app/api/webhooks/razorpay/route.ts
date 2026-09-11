import { NextResponse } from 'next/server';
import { activateRazorpayOrder, refundRazorpayPayment } from '@/lib/sponsor-engine';
import { verifyRazorpayWebhook } from '@/lib/razorpay';

type RazorpayWebhook = { event: string; payload: { payment?: { entity?: { id?: string; order_id?: string; status?: string; amount?: number; amount_refunded?: number; currency?: string; notes?: { bid_id?: string } } }; order?: { entity?: { id?: string; notes?: { bid_id?: string } } }; refund?: { entity?: { id?: string; payment_id?: string; amount?: number } } } };

export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyRazorpayWebhook(payload, request.headers.get('x-razorpay-signature'))) return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  const eventId = request.headers.get('x-razorpay-event-id');
  const event = JSON.parse(payload) as RazorpayWebhook;
  if (event.event === 'order.paid' || event.event === 'payment.captured') {
    const payment = event.payload.payment?.entity;
    const order = event.payload.order?.entity;
    const orderId = payment?.order_id || order?.id;
    if (!eventId || !payment?.id || !orderId || payment.status !== 'captured') return NextResponse.json({ error: 'invalid_payment_event' }, { status: 400 });
    await activateRazorpayOrder(orderId, payment.id, eventId, payment.amount ?? 0, payment.currency ?? "");
  } else if (event.event === 'refund.processed' || event.event === 'payment.refunded') {
    const refund = event.payload.refund?.entity; const payment = event.payload.payment?.entity;
    const paymentId = refund?.payment_id || payment?.id; const refundId = refund?.id || `payment-refund-${paymentId}`; const amount = refund?.amount ?? payment?.amount_refunded;
    if (!eventId || !paymentId || !refundId || !amount) return NextResponse.json({ error: 'invalid_refund_event' }, { status: 400 });
    await refundRazorpayPayment(paymentId, refundId, eventId, amount);
  }
  return NextResponse.json({ received: true });
}
