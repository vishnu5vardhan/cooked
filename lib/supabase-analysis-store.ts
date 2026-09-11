import { Analysis, Diagnosis, LeaderboardEntry } from './types';

type JsonRow = Record<string, unknown>;

function config() {
  if (process.env.COOKED_LOCAL_PREVIEW === '1' && process.env.VERCEL_ENV !== 'production') return null;
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export function hasSupabaseStore(): boolean {
  return Boolean(config());
}

async function rest(path: string, init: RequestInit = {}): Promise<JsonRow[]> {
  const settings = config();
  if (!settings) throw new Error('Supabase is not configured.');
  const response = await fetch(`${settings.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: settings.key,
      Authorization: `Bearer ${settings.key}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
  const payload = await response.text();
  if (!payload) return [];
  const body = JSON.parse(payload);
  return Array.isArray(body) ? body : [body];
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asDiagnoses(value: unknown): [Diagnosis, Diagnosis, Diagnosis] | null {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const diagnoses = value.map((item) => {
    const entry = item as JsonRow;
    if (!['confusion', 'trust', 'template'].includes(asText(entry.category))) return null;
    return {
      category: entry.category as Diagnosis['category'],
      label: asText(entry.label),
      score: asNumber(entry.score),
      evidence: asText(entry.evidence),
      roast: asText(entry.roast),
      fix: asText(entry.fix),
    };
  });
  return diagnoses.every(Boolean) ? diagnoses as [Diagnosis, Diagnosis, Diagnosis] : null;
}

function toAnalysis(row: JsonRow, hostname: string): Analysis | null {
  const diagnoses = asDiagnoses(row.diagnoses);
  if (!diagnoses || asText(row.status) !== 'published') return null;
  return {
    id: asText(row.id),
    siteId: asText(row.site_id),
    slug: asText(row.slug),
    status: 'published',
    siteType: asText(row.site_type),
    siteTypeConfidence: asNumber(row.site_type_confidence),
    captureMode: (['full', 'text_only', 'vision_only'].includes(asText(row.capture_mode)) ? row.capture_mode : 'text_only') as Analysis['captureMode'],
    hostname,
    screenshotUrl: asText(row.capture_mode) === 'text_only' ? '' : `/api/screenshots/${asText(row.slug)}`,
    confusionScore: asNumber(row.confusion_score),
    trustScore: asNumber(row.trust_score),
    templateScore: asNumber(row.template_score),
    totalScore: asNumber(row.total_score),
    diagnoses,
    archetype: asText(row.archetype),
    finalVerdict: asText(row.final_verdict),
    shareLine: asText(row.share_line),
    createdAt: asText(row.created_at),
    completedAt: asText(row.completed_at),
  };
}

async function findSite(origin: string): Promise<JsonRow | null> {
  const rows = await rest(`sites?select=id,hostname&normalized_origin=eq.${encodeURIComponent(origin)}&limit=1`);
  return rows[0] ?? null;
}

export async function loadCachedAnalysis(origin: string): Promise<Analysis | null> {
  const site = await findSite(origin);
  if (!site) return null;
  const cutoff = new Date(Date.now() - 86_400_000).toISOString();
  const rows = await rest(`analyses?select=*&site_id=eq.${encodeURIComponent(asText(site.id))}&status=eq.published&hidden_at=is.null&completed_at=gt.${encodeURIComponent(cutoff)}&order=completed_at.desc&limit=1`);
  return rows[0] ? toAnalysis(rows[0], asText(site.hostname)) : null;
}

export async function persistAnalysis(origin: string, analysis: Analysis): Promise<Analysis> {
  if (analysis.screenshotUrl.startsWith('data:image/jpeg;base64,')) {
    const settings = config()!;
    const upload = await fetch(`${settings.url}/storage/v1/object/cooked-screenshots/${analysis.id}.jpg`, {method:'POST', headers:{apikey:settings.key, Authorization:`Bearer ${settings.key}`, 'Content-Type':'image/jpeg'}, body:Buffer.from(analysis.screenshotUrl.split(',')[1],'base64'), signal:AbortSignal.timeout(12_000)});
    if (!upload.ok) throw new Error('Could not save the captured homepage.');
    analysis = {...analysis, screenshotUrl:`/api/screenshots/${analysis.slug}`};
  }
  const siteRows = await rest('sites?on_conflict=normalized_origin', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ normalized_origin: origin, hostname: analysis.hostname, updated_at: new Date().toISOString() }),
  });
  const site = siteRows[0];
  if (!site?.id) throw new Error('Supabase did not return a site record.');
  await rest('analyses', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      id: analysis.id,
      site_id: site.id,
      slug: analysis.slug,
      status: analysis.status,
      site_type: analysis.siteType,
      site_type_confidence: analysis.siteTypeConfidence,
      capture_mode: analysis.captureMode,
      diagnoses: analysis.diagnoses,
      confusion_score: analysis.confusionScore,
      trust_score: analysis.trustScore,
      template_score: analysis.templateScore,
      total_score: analysis.totalScore,
      archetype: analysis.archetype,
      final_verdict: analysis.finalVerdict,
      share_line: analysis.shareLine,
      model_id: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      prompt_version: '1',
      completed_at: analysis.completedAt,
    }),
  });
  return analysis;
}

export async function loadAnalysisBySlug(slug: string): Promise<Analysis | null> {
  const rows = await rest(`analyses?select=*,sites!inner(hostname)&slug=eq.${encodeURIComponent(slug)}&status=eq.published&hidden_at=is.null&limit=1`);
  const row = rows[0];
  const site = row?.sites as JsonRow | undefined;
  return row && site ? toAnalysis(row, asText(site.hostname)) : null;
}

export async function loadLeaderboard(mode: 'least' | 'most'): Promise<LeaderboardEntry[]> {
  const rows = await rest('rpc/cooked_website_leaderboard', {method: 'POST', body: JSON.stringify({p_mode: mode})});
  return rows.map((row, index) => ({rank:index + 1, hostname:asText(row.hostname), totalScore:asNumber(row.total_score), archetype:asText(row.archetype), shareLine:asText(row.share_line), slug:asText(row.slug), completedAt:asText(row.completed_at)}));
}

export async function loadScreenshot(id: string): Promise<Response> {
  const settings = config();
  if (!settings || !/^[a-f0-9-]{36}$/.test(id)) return new Response('Not found',{status:404});
  return fetch(`${settings.url}/storage/v1/object/cooked-screenshots/${id}.jpg`, {headers:{apikey:settings.key, Authorization:`Bearer ${settings.key}`}, signal:AbortSignal.timeout(12_000)});
}

export async function persistRemovalRequest(id: string, analysisId: string, contact: string, reason: string): Promise<void> {
  await rest('removal_requests', { method: 'POST', body: JSON.stringify({ id, analysis_id: analysisId, contact, reason }) });
}

export async function acceptRemovalRequest(requestId: string): Promise<void> {
  const rows = await rest('rpc/accept_cooked_removal', { method: 'POST', body: JSON.stringify({ p_request: requestId }) });
  const analysisId = asText(rows[0]); const settings = config();
  if (!analysisId || !settings) throw new Error('Removal acceptance did not return an analysis.');
  const deletion = await fetch(`${settings.url}/storage/v1/object/cooked-screenshots/${analysisId}.jpg`, { method: 'DELETE', headers: { apikey: settings.key, Authorization: `Bearer ${settings.key}` }, signal: AbortSignal.timeout(12_000) });
  if (!deletion.ok && deletion.status !== 404) throw new Error('Result was hidden but its screenshot could not be deleted.');
}
