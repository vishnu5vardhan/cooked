import { NextResponse } from 'next/server';
import { getActiveBrand, recordSponsorClick } from '@/lib/sponsor-engine';

export async function GET(request: Request, { params }: { params: Promise<{ brand: string }> }) {
  const { brand: id } = await params;
  const brand = await getActiveBrand(id);
  if (!brand) return NextResponse.redirect(new URL('/', request.url));
  const rawPlacement = new URL(request.url).searchParams.get('placement') || 'unknown'; const placement = /^[a-z0-9-]{1,32}$/i.test(rawPlacement) ? rawPlacement : 'unknown';
  const cookie = await recordSponsorClick(id, placement, request).catch(() => undefined);
  const response = NextResponse.redirect(brand.destinationUrl); if (cookie) response.headers.set('Set-Cookie', cookie); return response;
}
