import { ScoreBand, ScoreBandName } from './types';

/* ========================================
   Score Bands
   ======================================== */

export const SCORE_BANDS: ScoreBand[] = [
  { name: 'Suspiciously Competent', min: 0, max: 19, description: 'HOW IS THIS EVEN HERE.' },
  { name: 'Lightly Toasted', min: 20, max: 39, description: 'BARELY WARM. NEEDS MORE TIME.' },
  { name: 'Properly Cooked', min: 40, max: 59, description: 'GETTING THERE. STILL EDIBLE.' },
  { name: 'Well Done', min: 60, max: 79, description: 'WEBSITES THAT LOOK HOT BUT SERVE NOTHING.' },
  { name: 'Cremated', min: 80, max: 100, description: 'BEYOND SAVING. START OVER.' },
];

export function getScoreBand(score: number): ScoreBand {
  return SCORE_BANDS.find(b => score >= b.min && score <= b.max) || SCORE_BANDS[2];
}

export function getScoreBandName(score: number): ScoreBandName {
  return getScoreBand(score).name;
}

/* ========================================
   URL formatting
   ======================================== */

export function formatDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    let host = u.hostname.replace(/^www\./, '');
    if (host.length > 32) {
      host = host.slice(0, 14) + '…' + host.slice(-14);
    }
    return host;
  } catch {
    return url;
  }
}

/* ========================================
   Currency
   ======================================== */

export function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatCurrencyFull(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/* ========================================
   Score color
   ======================================== */

export function getScoreColor(score: number): string {
  if (score <= 19) return 'var(--success)';
  if (score <= 39) return 'var(--heat-amber)';
  return 'var(--ember)';
}

/* ========================================
   Misc
   ======================================== */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
