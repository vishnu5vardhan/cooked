import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { acceptRemovalRequest } from '@/lib/analysis-store';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const expected = process.env.COOKED_ADMIN_SECRET; const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!expected || expected.length !== supplied.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(supplied))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  try { await acceptRemovalRequest(id); return NextResponse.json({ accepted: true }); }
  catch (error) { return NextResponse.json({ error: 'acceptance_failed', message: error instanceof Error ? error.message : 'Could not accept removal.' }, { status: 400 }); }
}
