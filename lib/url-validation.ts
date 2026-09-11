/**
 * Cooked URL Validation & Normalization Service
 * Enforces security boundaries specified in SAFETY.md and ARCHITECTURE.md
 */

import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const PRIVATE_IP_REGEX = /^(?:10|127|192\.168|169\.254)\.|^172\.(?:1[6-9]|2[0-9]|3[0-1])\.|^::1$|^localhost$/i;
const ALLOWED_PORTS = new Set([80, 443, 8080, 8443]);

export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  hostname?: string;
  error?: string;
}

export function validateAndNormalizeUrl(inputUrl: string): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'That doesn’t look like a public website URL.' };
  }

  let raw = inputUrl.trim();
  if (!raw.match(/^https?:\/\//i)) {
    raw = `https://${raw}`;
  }

  try {
    const parsed = new URL(raw);

    // 1. Protocol check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'That doesn’t look like a public website URL.' };
    }

    // 2. Hostname safety check
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname || hostname.includes('..') || hostname.endsWith('.') || !hostname.includes('.')) {
      return { isValid: false, error: 'That doesn’t look like a public website URL.' };
    }

    // 3. Private IP & localhost check
    if (PRIVATE_IP_REGEX.test(hostname) || hostname.endsWith('.local') || hostname.endsWith('.localhost') || hostname.endsWith('.internal')) {
      return { isValid: false, error: 'Local and private-network websites can’t enter the oven.' };
    }

    // 4. Port safety check
    if (parsed.port && !ALLOWED_PORTS.has(parseInt(parsed.port, 10))) {
      return { isValid: false, error: 'That doesn’t look like a public website URL.' };
    }

    // 5. Embedded credentials check
    if (parsed.username || parsed.password) {
      return { isValid: false, error: 'That doesn’t look like a public website URL.' };
    }

    // 6. Strip tracking params and fragments
    parsed.hash = '';
    const cleanSearchParams = new URLSearchParams();
    // Keep essential params, strip common ad/tracking parameters
    for (const [key, value] of parsed.searchParams.entries()) {
      if (!key.match(/^(utm_|fbclid|gclid|msclkid|_ga|ref|source)/i)) {
        cleanSearchParams.set(key, value);
      }
    }
    parsed.search = cleanSearchParams.toString() ? `?${cleanSearchParams.toString()}` : '';

    // Analyses intentionally target the final public origin homepage, never a deep or tracking URL.
    parsed.pathname = '/';
    parsed.search = '';
    const normalizedUrl = parsed.toString().replace(/\/$/, '');

    return {
      isValid: true,
      normalizedUrl,
      hostname: parsed.hostname,
    };
  } catch {
    return { isValid: false, error: 'That doesn’t look like a public website URL.' };
  }
}

function isPrivateAddress(address: string): boolean {
  if (PRIVATE_IP_REGEX.test(address) || /^(?:0|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])|192\.0\.0|192\.0\.2|198\.(?:1[89])|198\.51\.100|203\.0\.113|224\.|2[34]\d\.|25[0-5]\.)/.test(address) || address === '255.255.255.255') return true;
  if (address.includes(':')) {
    const normalized = address.toLowerCase();
    if (normalized.startsWith('::ffff:')) return isPrivateAddress(normalized.slice(7));
    return normalized === '::' || normalized === '::1' || normalized.startsWith('fc') || normalized.startsWith('fd') || /^fe[89ab]/.test(normalized) || normalized.startsWith('ff') || normalized.startsWith('2001:db8:');
  }
  return false;
}

/** Re-check DNS immediately before every server-side fetch to block SSRF targets. */
export async function assertPublicHostname(hostname: string): Promise<void> {
  if (isIP(hostname) && isPrivateAddress(hostname)) {
    throw new Error('Local and private-network websites can’t enter the oven.');
  }
  const records = await lookup(hostname, { all: true, verbatim: true });
  if (!records.length || records.some((record) => isPrivateAddress(record.address))) {
    throw new Error('Local and private-network websites can’t enter the oven.');
  }
}
