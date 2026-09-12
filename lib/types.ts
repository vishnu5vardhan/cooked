/* ========================================
   TypeScript Types for Cooked
   ======================================== */

export interface Site {
  id: string;
  normalizedOrigin: string;
  hostname: string;
  title: string;
  description: string;
  faviconUrl: string;
  latestScreenshotPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnosis {
  category: 'confusion' | 'trust' | 'template';
  label: string;
  score: number;
  evidence: string;
  roast: string;
  fix: string;
}

export interface Analysis {
  id: string;
  siteId: string;
  slug: string;
  status: 'processing' | 'published' | 'failed' | 'blocked' | 'hidden';
  siteType: string;
  siteTypeConfidence: number;
  captureMode: 'full' | 'text_only' | 'vision_only';
  hostname: string;
  screenshotUrl: string;
  confusionScore: number;
  trustScore: number;
  templateScore: number;
  totalScore: number;
  diagnoses: [Diagnosis, Diagnosis, Diagnosis];
  archetype: string;
  finalVerdict: string;
  shareLine: string;
  createdAt: string;
  completedAt: string;
}

export type ScoreBandName =
  | 'Suspiciously Competent'
  | 'Lightly Toasted'
  | 'Properly Cooked'
  | 'Well Done'
  | 'Cremated';

export interface ScoreBand {
  name: ScoreBandName;
  min: number;
  max: number;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  normalizedDomain: string;
  destinationUrl: string;
  contactEmail: string;
  logoSvg: string;
  tagline: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  rank: number;
  eligibleSpend: number;
  earliestExpiry: string;
  impressions: number;
  clicks: number;
  overtakeAmount: number;
  createdAt: string;
}

export type PublicBrand = Pick<Brand,
  'id' | 'name' | 'normalizedDomain' | 'destinationUrl' | 'logoSvg' | 'tagline' |
  'rank' | 'eligibleSpend' | 'earliestExpiry' | 'impressions' | 'clicks' | 'overtakeAmount'
>;

export interface CookingStage {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

export type CookingState = 'idle' | 'validating' | 'capturing' | 'cooking' | 'complete' | 'error';

export type OvenState = 'idle' | 'cooking' | 'result';

export interface LeaderboardEntry {
  rank: number;
  hostname: string;
  totalScore: number;
  archetype: string;
  shareLine: string;
  slug: string;
  completedAt: string;
}

/** A free, time-bound promotion earned by a genuinely strong public homepage. */
export interface EarnedPlacement {
  analysisId: string;
  slug: string;
  hostname: string;
  destinationUrl: string;
  totalScore: number;
  expiresAt: string;
}
