import { NextResponse } from 'next/server';
import { getRankedBrands, publicBrand } from '@/lib/sponsor-engine';

export async function GET() {
  const brands = await getRankedBrands();

  return NextResponse.json({
    brands: brands.map(publicBrand),
    totalActiveBrands: brands.length,
  });
}
