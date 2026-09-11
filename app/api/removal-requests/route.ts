import { NextResponse } from 'next/server';
import { createRemovalRequest } from '@/lib/analysis-store';

export async function POST(request: Request) {
  try {
    const { slug, contact, reason } = await request.json();
    if (!/^[a-z0-9-]+$/.test(slug || '') || typeof contact !== 'string' || contact.trim().length < 3 || contact.length > 200 || typeof reason !== 'string' || reason.trim().length < 10 || reason.length > 2_000) return NextResponse.json({ success: false, message: 'Enter valid contact details and a short reason.' }, { status: 400 });
    const requestId = await createRemovalRequest(slug, contact.trim(), reason.trim());
    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Could not submit this request.' }, { status: 400 });
  }
}
