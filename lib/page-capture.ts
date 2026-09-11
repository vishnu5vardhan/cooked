import { assertPublicHostname, validateAndNormalizeUrl } from './url-validation';

export interface PageEvidence {
  finalUrl: string; title: string; description: string; headings: string[]; navigation: string[]; callsToAction: string[]; visibleText: string;
  screenshot?: string;
  captureMode: 'full' | 'text_only' | 'vision_only'; limitations: string[];
}

const MAX_BODY_BYTES = 750_000;
const decode = (value: string) => value.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const cleanText = (value: string) => decode(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const matches = (html: string, expression: RegExp, limit: number) => [...html.matchAll(expression)].map((match) => cleanText(match[1] ?? '')).filter(Boolean).slice(0, limit);

async function captureText(startUrl: string, signal?: AbortSignal): Promise<PageEvidence> {
  let target = startUrl;
  let response: Response | undefined;
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    const url = new URL(target);
    const validation = validateAndNormalizeUrl(url.toString());
    if (!validation.isValid) throw new Error(validation.error);
    await assertPublicHostname(url.hostname);
    response = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'CookedBot/1.0', Accept: 'text/html,application/xhtml+xml' }, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(12_000)]) : AbortSignal.timeout(12_000) });
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    const location = response.headers.get('location');
    if (!location || redirects === 3) throw new Error('This site refused to get in the oven.');
    target = new URL(location, target).toString();
    const redirect = validateAndNormalizeUrl(target);
    if (!redirect.isValid) throw new Error(redirect.error);
  }
  if (!response?.ok) throw new Error('We knocked. Nobody answered. Check the URL and try again.');
  if (!(response.headers.get('content-type') ?? '').includes('text/html')) throw new Error('This site refused to get in the oven.');
  if (Number(response.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) throw new Error('This site refused to get in the oven.');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('This site refused to get in the oven.');
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error('This site refused to get in the oven.');
    }
    chunks.push(value);
  }
  const html = new TextDecoder().decode(Buffer.concat(chunks));
  const withoutUnsafe = html.replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  if (cleanText(withoutUnsafe).length < 80) throw new Error('This page did not expose enough public text to roast. Try another homepage.');
  return {
    finalUrl: target, title: cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: cleanText(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] ?? ''),
    headings: matches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 12), navigation: matches(html, /<(?:nav|a)[^>]*>([\s\S]*?)<\/(?:nav|a)>/gi, 20),
    callsToAction: matches(html, /<(?:button|a)[^>]*>([\s\S]*?)<\/(?:button|a)>/gi, 15), visibleText: cleanText(withoutUnsafe).slice(0, 15_000),
    captureMode: 'text_only', limitations: ['Text-only capture: no screenshot provider is configured, so visual claims are excluded.'],
  };
}

// ScreenshotOne renders the public page; independent sources allow text-only and vision-only fallback.
export async function capturePublicPage(startUrl: string, signal?: AbortSignal): Promise<PageEvidence> {
  await assertPublicHostname(new URL(startUrl).hostname);
  const screenshot = async () => {
    if (!process.env.SCREENSHOTONE_ACCESS_KEY) return undefined;
    const response = await fetch('https://api.screenshotone.com/take', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({access_key: process.env.SCREENSHOTONE_ACCESS_KEY, url: startUrl, viewport_width: 1440, viewport_height: 1000, format: 'jpeg', image_quality: 75, block_cookie_banners: true, block_ads: true, timeout: 15}),
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(18_000)]) : AbortSignal.timeout(18_000),
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('image/jpeg')) throw new Error('Screenshot capture failed.');
    const reader = response.body!.getReader(); const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const {value, done} = await reader.read(); if (done) break; size += value.length; if (size > 2_000_000) { await reader.cancel(); throw new Error('Screenshot too large.'); } chunks.push(value); }
    return `data:image/jpeg;base64,${Buffer.concat(chunks).toString('base64')}`;
  };
  const [text, image] = await Promise.allSettled([captureText(startUrl, signal), screenshot()]);
  const data = text.status === 'fulfilled' ? text.value : null;
  const shot = image.status === 'fulfilled' ? image.value : undefined;
  if (!data && !shot) throw new Error('This homepage could not be captured. Please try another website.');
  return { ...(data || {finalUrl: startUrl, title: '', description: '', headings: [], navigation: [], callsToAction: [], visibleText: ''}), screenshot: shot,
    captureMode: shot ? data ? 'full' : 'vision_only' : 'text_only',
    limitations: shot ? data ? [] : ['Only the screenshot is available; do not infer hidden page text.'] : ['Screenshot unavailable. Do not make visual claims.'],
  };
}
