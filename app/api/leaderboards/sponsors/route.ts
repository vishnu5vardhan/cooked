import { NextResponse } from 'next/server';
import { getRankedBrands, publicBrand } from '@/lib/sponsor-engine';
import { getEarnedPlacement } from '@/lib/analysis-store';

export async function GET() {
  const [brands, earnedPlacement] = await Promise.all([getRankedBrands(), getEarnedPlacement()]);

  return NextResponse.json({
    brands: brands.map(publicBrand),
    totalActiveBrands: brands.length,
    earnedPlacement,
  });
}
