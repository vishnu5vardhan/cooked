import { mkdir, readdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Analysis, LeaderboardEntry } from './types';
import { acceptRemovalRequest as acceptSupabaseRemoval, hasSupabaseStore, loadAnalysisBySlug, loadCachedAnalysis, loadLeaderboard, persistAnalysis, persistRemovalRequest } from './supabase-analysis-store';

// ponytail: file storage is for one local development process; Supabase is required on Vercel.
const directory = join(process.cwd(), '.cooked', 'analyses');
async function localAnalyses(): Promise<Analysis[]> {
  await mkdir(directory, {recursive: true});
  const files = (await readdir(directory)).filter(name => name.endsWith('.json'));
  return Promise.all(files.map(async name => JSON.parse(await readFile(join(directory, name), 'utf8')) as Analysis));
}
function assertLocal() { if (process.env.VERCEL) throw new Error('Configure Supabase before publishing roasts.'); }

export async function getCachedAnalysis(origin: string): Promise<Analysis | null> {
  if (hasSupabaseStore()) return loadCachedAnalysis(origin);
  assertLocal();
  return (await localAnalyses()).filter(a => a.siteId === origin && a.status === 'published' && Date.now() - Date.parse(a.completedAt) < 86_400_000).sort((a,b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))[0] ?? null;
}

export async function saveAnalysis(origin: string, analysis: Analysis): Promise<Analysis> {
  if (hasSupabaseStore()) return persistAnalysis(origin, analysis);
  assertLocal();
  await mkdir(directory, {recursive: true});
  const path = join(directory, `${analysis.slug}.json`);
  await writeFile(path + '.tmp', JSON.stringify({...analysis, siteId: origin}));
  await rename(path + '.tmp', path);
  return analysis;
}

export async function getAnalysisBySlug(slug: string): Promise<Analysis | null> {
  if (hasSupabaseStore()) return loadAnalysisBySlug(slug);
  assertLocal();
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try { const analysis = JSON.parse(await readFile(join(directory, `${slug}.json`), 'utf8')) as Analysis; return analysis.status === 'published' ? analysis : null; } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') { const prior = (globalThis as unknown as {__analysesBySlug?: Map<string, Analysis>}).__analysesBySlug?.get(slug); return prior?.status === 'published' ? saveAnalysis(prior.siteId, prior) : null; } throw error; }
}

export async function getLeaderboard(mode: 'least' | 'most'): Promise<LeaderboardEntry[]> {
  if (hasSupabaseStore()) return loadLeaderboard(mode);
  assertLocal();
  return rankWebsiteAnalyses(await localAnalyses(), mode); 
}

export function rankWebsiteAnalyses(analyses: Analysis[], mode: 'least' | 'most', now = Date.now()): LeaderboardEntry[] {
  const latest = new Map<string, Analysis>();
  for (const analysis of analyses) {
    if (analysis.status !== 'published' || Date.parse(analysis.completedAt) <= now - 86_400_000 || Date.parse(analysis.completedAt) > now) continue;
    const prior = latest.get(analysis.hostname);
    if (!prior || Date.parse(analysis.completedAt) > Date.parse(prior.completedAt)) latest.set(analysis.hostname, analysis);
  }
  return [...latest.values()].sort((a,b) => (mode === 'least' ? a.totalScore - b.totalScore : b.totalScore - a.totalScore) || a.completedAt.localeCompare(b.completedAt) || a.hostname.localeCompare(b.hostname)).slice(0,20).map((a,i) => ({rank:i+1, hostname:a.hostname, totalScore:a.totalScore, archetype:a.archetype, shareLine:a.shareLine, slug:a.slug, completedAt:a.completedAt}));
}

export async function createRemovalRequest(slug: string, contact: string, reason: string): Promise<string> {
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) throw new Error('That public result was not found.');
  const id = randomUUID();
  if (hasSupabaseStore()) { await persistRemovalRequest(id, analysis.id, contact, reason); return id; }
  assertLocal();
  const requests = join(process.cwd(), '.cooked', 'removal-requests'); await mkdir(requests, { recursive: true });
  await writeFile(join(requests, `${id}.json`), JSON.stringify({ id, analysisId: analysis.id, slug, contact, reason, status: 'open', createdAt: new Date().toISOString() }));
  return id;
}

export async function acceptRemovalRequest(id: string): Promise<void> {
  if (hasSupabaseStore()) return acceptSupabaseRemoval(id);
  assertLocal(); const requests = join(process.cwd(), '.cooked', 'removal-requests'); const requestPath = join(requests, `${id}.json`);
  const removal = JSON.parse(await readFile(requestPath, 'utf8')) as { slug: string; status: string };
  if (removal.status !== 'open') throw new Error('Open removal request not found.');
  const analysisPath = join(directory, `${removal.slug}.json`); const analysis = JSON.parse(await readFile(analysisPath, 'utf8')) as Analysis;
  await writeFile(analysisPath, JSON.stringify({ ...analysis, status: 'hidden', screenshotUrl: '', diagnoses: [], archetype: '', finalVerdict: '', shareLine: '' }));
  await writeFile(requestPath, JSON.stringify({ ...removal, status: 'accepted', resolvedAt: new Date().toISOString() }));
}
