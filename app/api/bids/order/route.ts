import { NextResponse } from 'next/server';
import { attachRazorpayOrder, calculateSponsorQuote, createOrFindBrand, createPendingBid } from '@/lib/sponsor-engine';
import { createRazorpayOrder } from '@/lib/razorpay';
import { validateAndNormalizeUrl } from '@/lib/url-validation';

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ success: false, error: 'payments_unavailable', message: 'Razorpay is not configured yet.' }, { status: 503 });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ success: false, message: 'Sponsor checkout is being configured. Please try again shortly.' }, { status: 503 });
  try {
    const { name, destinationUrl, contactEmail, tagline, logo, targetRank = 1 } = await request.json();
    if (!name || !destinationUrl) return NextResponse.json({ success: false, error: 'missing_fields', message: 'Name and destination URL are required.' }, { status: 400 });
    const validation = validateAndNormalizeUrl(destinationUrl);
    if (!validation.isValid || !validation.normalizedUrl?.startsWith('https://')) throw new Error('Use a safe public HTTPS destination.');
    const brand = await createOrFindBrand({ name, destinationUrl: validation.normalizedUrl, contactEmail, tagline, logo });
    if (brand.moderationStatus !== 'approved') return NextResponse.json({ success: false, error: 'pending_moderation', message: 'This brand or destination can’t be displayed in Cooked.' }, { status: 409 });
    const quote = await calculateSponsorQuote(Number(targetRank), undefined, brand.id);
    const bid = await createPendingBid(brand.id, quote.requestedAmount, quote.projectedRank);
    const order = await createRazorpayOrder({ amount: quote.requestedAmount, bidId: bid.id });
    await attachRazorpayOrder(bid.id, order.id);
    return NextResponse.json({ success: true, bidId: bid.id, orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, brandName: brand.name });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'order_error', message: error instanceof Error ? error.message : 'Could not create a payment order.' }, { status: 500 });
  }
}
