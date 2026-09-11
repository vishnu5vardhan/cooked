import { NextResponse } from 'next/server';
import { getAnalysisBySlug } from '@/lib/roast-engine';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analysis = await getAnalysisBySlug(id);

  if (!analysis) {
    return NextResponse.json(
      { status: 'not_found', message: 'No analysis found. Please submit the website again.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: analysis.status,
    slug: analysis.slug,
    completedAt: analysis.completedAt,
  });
}
