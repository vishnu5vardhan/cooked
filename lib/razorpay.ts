import { createHmac, timingSafeEqual } from 'node:crypto';

type RazorpayOrder = { id: string; amount: number; currency: string };

const equal = (left: string, right: string) => /^[a-f0-9]{64}$/i.test(right) && timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));

export async function createRazorpayOrder(input: { amount: number; bidId: string }): Promise<RazorpayOrder> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay is not configured yet.');
  if (!Number.isSafeInteger(input.amount) || input.amount < 1) throw new Error('Razorpay orders must be at least 100 currency subunits.');
  if ((process.env.RAZORPAY_CURRENCY || 'USD') !== 'USD') throw new Error('Sponsor prices are in USD. Enable USD payments before checkout.');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: input.amount * 100, currency: process.env.RAZORPAY_CURRENCY || 'USD', receipt: `cooked_${input.bidId.slice(0, 26)}`, notes: { bid_id: input.bidId } }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Razorpay order could not be created (${response.status}).`);
  const order = await response.json() as Partial<RazorpayOrder>;
  if (!order.id || !order.amount || !order.currency) throw new Error('Razorpay returned an incomplete order.');
  return order as RazorpayOrder;
}

export function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId || !signature) return false;
  return equal(createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex'), signature);
}

export function verifyRazorpayWebhook(payload: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  return equal(createHmac('sha256', secret).update(payload).digest('hex'), signature);
}
