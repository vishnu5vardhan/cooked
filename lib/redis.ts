import { createHash, createHmac, randomUUID } from 'node:crypto';

const config = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, ''); const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
};

async function command<T>(body: unknown[]): Promise<T | null> {
  const settings = config(); if (!settings) return null;
  const response = await fetch(settings.url, { method: 'POST', headers: { Authorization: `Bearer ${settings.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(5_000) });
  if (!response.ok) throw new Error(`Redis request failed (${response.status}).`);
  return (await response.json() as { result: T }).result;
}

export async function rateLimit(request: Request, scope: 'analysis' | 'quote'): Promise<{ allowed: boolean; retryAfter: number; cookie?: string }> {
  const settings = config();
  if (!settings) {
    if (process.env.VERCEL_ENV === 'production') throw new Error('Redis rate limiting is not configured.');
    return { allowed: true, retryAfter: 0 };
  }
  const cookieMatch = request.headers.get('cookie')?.match(/(?:^|;\s*)cooked_session=([a-f0-9-]{36})/i);
  const session = cookieMatch?.[1] || randomUUID(); const cookie = cookieMatch ? undefined : `cooked_session=${session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  const secret = process.env.ANON_HMAC_SECRET || settings.token; const network = createHmac('sha256', secret).update(ip).digest('hex');
  const rules = scope === 'quote' ? [[`quote:session:${session}`, 3, 60]] as const : [[`analysis:session:${session}`, 5, 3600], [`analysis:network:${network}`, 10, 3600]] as const;
  let retryAfter = 0;
  for (const [key, limit, seconds] of rules) {
    const result = await command<[number, number]>(['EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('TTL',KEYS[1])}", '1', key, String(seconds)]);
    if (result && result[0] > limit) retryAfter = Math.max(retryAfter, result[1]);
  }
  return { allowed: retryAfter === 0, retryAfter: Math.max(1, retryAfter), cookie };
}

export async function acquireAnalysisLock(origin: string): Promise<{ key: string; token: string } | null | undefined> {
  if (!config()) return undefined;
  const key = `analysis:lock:${createHash('sha256').update(origin).digest('hex')}`; const token = randomUUID();
  return await command<string>(['SET', key, token, 'NX', 'PX', '115000']) === 'OK' ? { key, token } : null;
}

export async function releaseAnalysisLock(lock: { key: string; token: string }): Promise<void> {
  await command(['EVAL', "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end", '1', lock.key, lock.token]);
}
