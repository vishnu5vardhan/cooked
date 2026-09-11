import HomeExperience from '@/components/HomeExperience';
import { getAnalysisBySlug } from '@/lib/analysis-store';
import { getRankedBrands, publicBrand } from '@/lib/sponsor-engine';
export default async function HomePage({ searchParams }: { searchParams: Promise<{challenge?: string}> }) {
  const {challenge: slug} = await searchParams;
  const [analysis, brands] = await Promise.all([slug ? getAnalysisBySlug(slug) : null, getRankedBrands()]);
  return <HomeExperience initialBrands={brands.map(publicBrand)} challenge={analysis ? {slug: analysis.slug, hostname: analysis.hostname, totalScore: analysis.totalScore} : undefined} />;
}
