import { NextResponse } from 'next/server';
import { calculateSponsorQuote, createOrFindBrand } from '@/lib/sponsor-engine';
import { validateAndNormalizeUrl } from '@/lib/url-validation';
import { rateLimit } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, 'quote');
    if (!limit.allowed) return NextResponse.json({ success: false, error: 'rate_limited', message: 'Too many quote attempts. Try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter), ...(limit.cookie ? { 'Set-Cookie': limit.cookie } : {}) } });
    const body = await request.json();
    const { targetRank = 1, name, destinationUrl, contactEmail, tagline, logo } = body || {};
    const validation = validateAndNormalizeUrl(destinationUrl || '');
    if (!validation.isValid || !validation.normalizedUrl || !validation.normalizedUrl.startsWith('https://')) throw new Error('Use a safe public HTTPS destination.');
    const brand = await createOrFindBrand({ name, destinationUrl: validation.normalizedUrl, contactEmail, tagline, logo });

    const quote = await calculateSponsorQuote(Number(targetRank), undefined, brand.id);

    return NextResponse.json({
      success: true,
      quote, brandId: brand.id,
    }, limit.cookie ? { headers: { 'Set-Cookie': limit.cookie } } : undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    return NextResponse.json(
      { success: false, error: 'invalid_quote', message },
      { status: 400 }
    );
  }
}
