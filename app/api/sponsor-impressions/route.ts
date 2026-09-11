import { NextResponse } from 'next/server';
import { getRankedBrands, recordSponsorImpressions } from '@/lib/sponsor-engine';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null); const submitted = Array.isArray(body?.items) ? body.items.slice(0, 8) : [];
  const active = new Set((await getRankedBrands()).map((brand) => brand.id));
  const items = submitted.filter((item: unknown): item is { id: string; placement: string } => { const value = item as { id?: unknown; placement?: unknown }; return typeof value.id === 'string' && active.has(value.id) && typeof value.placement === 'string' && /^[a-z0-9-]{1,32}$/i.test(value.placement); });
  const cookie = await recordSponsorImpressions(items, request);
  return NextResponse.json({ recorded: items.length }, cookie ? { headers: { 'Set-Cookie': cookie } } : undefined);
}
