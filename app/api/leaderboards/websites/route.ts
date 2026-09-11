import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/analysis-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') === 'least' ? 'least' : 'most';
  const entries = await getLeaderboard(mode);

  return NextResponse.json({
    mode,
    entries,
  });
}
