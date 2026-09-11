import { NextResponse } from 'next/server';
import { validateAndNormalizeUrl } from '@/lib/url-validation';
import { runAnalysisPipeline } from '@/lib/roast-engine';
import { getCachedAnalysis } from '@/lib/analysis-store';
import { rateLimit } from '@/lib/redis';

export const maxDuration = 120;

export async function POST(request: Request) {
  let url: unknown;
  try { ({ url } = await request.json()); } catch { return NextResponse.json({ success: false, message: 'Enter a website URL.' }, { status: 400 }); }
  const validation = validateAndNormalizeUrl(typeof url === 'string' ? url : '');
  if (!validation.isValid || !validation.normalizedUrl || !validation.hostname) {
    return NextResponse.json({ success: false, error: 'invalid_url', message: validation.error || 'Enter a public website URL.' }, { status: 400 });
  }
  const signal = AbortSignal.timeout(105_000);
  const cached = await getCachedAnalysis(validation.normalizedUrl);
  let limit: Awaited<ReturnType<typeof rateLimit>> = { allowed: true, retryAfter: 0 };
  if (!cached) {
    try { limit = await rateLimit(request, 'analysis'); }
    catch { return NextResponse.json({ success: false, error: 'internal', message: 'Analysis protection is temporarily unavailable.' }, { status: 503 }); }
    if (!limit.allowed) return NextResponse.json({ success: false, error: 'rate_limited', message: 'The oven needs a short break. Try again later.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter), ...(limit.cookie ? { 'Set-Cookie': limit.cookie } : {}) } });
  }
  const encoder = new TextEncoder();
  const streaming = request.headers.get('accept') === 'application/x-ndjson';
  const run = (onStage: (stage: number, screenshot?: string) => void) => runAnalysisPipeline(validation.hostname!, validation.normalizedUrl!, onStage, signal);
  const failure = (error: unknown) => {
    console.error(JSON.stringify({ event: 'analysis_failed', message: error instanceof Error ? error.message : 'Unknown error' }));
    return { success: false, error: 'generation_failed', message: signal.aborted ? 'This site took too long. Please retry or try another homepage.' : 'We couldn’t finish this roast. The site or analysis service may be unavailable. Please try again.' };
  };
  if (!streaming) {
    try { const result = cached ? { analysis: cached, cached: true } : await run(() => {}); return NextResponse.json({ success: true, slug: result.analysis.slug, cached: result.cached }, limit.cookie ? { headers: { 'Set-Cookie': limit.cookie } } : undefined); }
    catch (error) { return NextResponse.json(failure(error), { status: 502 }); }
  }
  let closed = false;
  return new Response(new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => { if (!closed) controller.enqueue(encoder.encode(JSON.stringify(data) + '\n')); };
      try {
        const result = cached ? { analysis: cached, cached: true } : await run((stage, screenshot) => send({ stage, screenshot }));
        send({ success: true, slug: result.analysis.slug, cached: result.cached });
      } catch (error) { send(failure(error)); }
      finally { if (!closed) { closed = true; controller.close(); } }
    },
    cancel() { closed = true; },
  }), { headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', ...(limit.cookie ? { 'Set-Cookie': limit.cookie } : {}) } });
}
