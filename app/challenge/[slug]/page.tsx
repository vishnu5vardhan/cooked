import { notFound } from 'next/navigation';
import HomeExperience from '@/components/HomeExperience';
import { getAnalysisBySlug } from '@/lib/analysis-store';
import { getRankedBrands, publicBrand } from '@/lib/sponsor-engine';
export const metadata = {robots: {index: false, follow: false}};
export default async function ChallengePage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const [result, brands] = await Promise.all([getAnalysisBySlug(slug), getRankedBrands()]);
  if (!result) notFound();
  return <HomeExperience initialBrands={brands.map(publicBrand)} challenge={{slug, hostname: result.hostname, totalScore: result.totalScore}} />;
}
