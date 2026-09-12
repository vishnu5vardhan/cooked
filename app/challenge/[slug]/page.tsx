import { notFound } from 'next/navigation';
import HomeExperience from '@/components/HomeExperience';
import { getAnalysisBySlug, getEarnedPlacement } from '@/lib/analysis-store';
import { getRankedBrands, publicBrand } from '@/lib/sponsor-engine';
export const metadata = {robots: {index: false, follow: false}};
export default async function ChallengePage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const [result, brands, earnedPlacement] = await Promise.all([getAnalysisBySlug(slug), getRankedBrands(), getEarnedPlacement()]);
  if (!result) notFound();
  return <HomeExperience initialBrands={brands.map(publicBrand)} earnedPlacement={earnedPlacement} challenge={{slug, hostname: result.hostname, totalScore: result.totalScore}} />;
}
