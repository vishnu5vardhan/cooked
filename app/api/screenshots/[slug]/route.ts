import {getAnalysisBySlug} from '@/lib/analysis-store';
import {loadScreenshot} from '@/lib/supabase-analysis-store';
export async function GET(_request: Request, {params}: {params:Promise<{slug:string}>}) {
  const {slug}=await params; const analysis=await getAnalysisBySlug(slug);
  if (!analysis || !analysis.screenshotUrl) return new Response('Not found',{status:404});
  const response=await loadScreenshot(analysis.id);
  if (!response.ok) return new Response('Not found',{status:404});
  return new Response(response.body,{headers:{'Content-Type':'image/jpeg','Cache-Control':'private, no-store'}});
}
