import { Brand, Analysis, LeaderboardEntry } from './types';

/* ========================================
   Sponsor Brand SVG Logos
   ======================================== */

const HEATWAVE_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4C20 4 10 15 10 24C10 29.5 14.5 34 20 34C25.5 34 30 29.5 30 24C30 15 20 4 20 4Z" fill="#FF552E"/><path d="M20 14C20 14 14 21 14 25.5C14 28.8 16.7 31 20 31C23.3 31 26 28.8 26 25.5C26 21 20 14 20 14Z" fill="#FF8A45"/></svg>`;

const PEAKLY_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 28L18 10L24 20L28 14L33 28H7Z" fill="#FAFAFA"/></svg>`;

const BRIGHTLY_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6C12.268 6 6 12.268 6 20C6 27.732 12.268 34 20 34C27.732 34 34 27.732 34 20C34 12.268 27.732 6 20 6ZM20 12C24.418 12 28 15.582 28 20C28 24.418 24.418 28 20 28C15.582 28 12 24.418 12 20C12 15.582 15.582 12 20 12Z" fill="#FF552E"/></svg>`;

const NIMBLE_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L32 13V27L20 34L8 27V13L20 6Z" fill="#FAFAFA"/><path d="M20 6L32 13L20 20L8 13L20 6Z" fill="#E1E5E8"/><path d="M20 20V34L32 27V13L20 20Z" fill="#B0B8C0"/></svg>`;

const STACKR_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L32 13L20 20L8 13L20 6Z" fill="#FAFAFA"/><path d="M8 18.5L20 25.5L32 18.5L34.5 20L20 28.5L5.5 20L8 18.5Z" fill="#FAFAFA"/><path d="M8 25.5L20 32.5L32 25.5L34.5 27L20 35.5L5.5 27L8 25.5Z" fill="#FAFAFA"/></svg>`;

const LUME_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4C20 12.8 12.8 20 4 20C12.8 20 20 27.2 20 36C20 27.2 27.2 20 36 20C27.2 20 20 12.8 20 4Z" fill="#FAFAFA"/></svg>`;

const FLOWLY_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 16C11 10 17 10 22 16C27 22 33 22 38 16" stroke="#FAFAFA" stroke-width="4" stroke-linecap="round"/><path d="M6 24C11 18 17 18 22 24C27 30 33 30 38 24" stroke="#FAFAFA" stroke-width="4" stroke-linecap="round"/></svg>`;

const GREENHOST_LOGO = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6C20 6 7 15 7 24C7 29.5 12.5 34 20 34C27.5 34 33 29.5 33 24C33 15 20 6 20 6Z" fill="#FAFAFA"/><path d="M20 12V30M20 20L13 15M20 24L27 19" stroke="#171C1F" stroke-width="2.5" stroke-linecap="round"/></svg>`;


/* ========================================
   Seeded Sponsor Brands
   ======================================== */

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'brand-1',
    name: 'HeatWave',
    normalizedDomain: 'heatwave.dev',
    destinationUrl: 'https://heatwave.dev',
    contactEmail: 'ads@heatwave.dev',
    logoSvg: HEATWAVE_LOGO,
    tagline: 'FUELING BRUTAL HONESTY',
    moderationStatus: 'approved',
    rank: 1,
    eligibleSpend: 12500,
    earliestExpiry: '2026-09-14T00:00:00Z',
    impressions: 48200,
    clicks: 1890,
    overtakeAmount: 0,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'brand-2',
    name: 'Peakly',
    normalizedDomain: 'peakly.io',
    destinationUrl: 'https://peakly.io',
    contactEmail: 'hello@peakly.io',
    logoSvg: PEAKLY_LOGO,
    tagline: 'HIGHER STANDARDS',
    moderationStatus: 'approved',
    rank: 2,
    eligibleSpend: 7800,
    earliestExpiry: '2026-09-13T00:00:00Z',
    impressions: 42100,
    clicks: 1340,
    overtakeAmount: 4705,
    createdAt: '2026-09-02T00:00:00Z',
  },
  {
    id: 'brand-3',
    name: 'Brightly',
    normalizedDomain: 'brightly.co',
    destinationUrl: 'https://brightly.co',
    contactEmail: 'brand@brightly.co',
    logoSvg: BRIGHTLY_LOGO,
    tagline: 'SHINE ONLINE',
    moderationStatus: 'approved',
    rank: 3,
    eligibleSpend: 6200,
    earliestExpiry: '2026-09-15T00:00:00Z',
    impressions: 39800,
    clicks: 1120,
    overtakeAmount: 1605,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'brand-4',
    name: 'Nimble',
    normalizedDomain: 'nimble.tools',
    destinationUrl: 'https://nimble.tools',
    contactEmail: 'growth@nimble.tools',
    logoSvg: NIMBLE_LOGO,
    tagline: 'BUILT FOR BETTER WEBSITES',
    moderationStatus: 'approved',
    rank: 4,
    eligibleSpend: 4900,
    earliestExpiry: '2026-09-14T00:00:00Z',
    impressions: 35400,
    clicks: 890,
    overtakeAmount: 1305,
    createdAt: '2026-09-03T00:00:00Z',
  },
  {
    id: 'brand-5',
    name: 'Stackr',
    normalizedDomain: 'stackr.dev',
    destinationUrl: 'https://stackr.dev',
    contactEmail: 'hey@stackr.dev',
    logoSvg: STACKR_LOGO,
    tagline: 'MORE THAN A WEBSITE',
    moderationStatus: 'approved',
    rank: 5,
    eligibleSpend: 3400,
    earliestExpiry: '2026-09-12T00:00:00Z',
    impressions: 31200,
    clicks: 710,
    overtakeAmount: 1505,
    createdAt: '2026-09-02T00:00:00Z',
  },
  {
    id: 'brand-6',
    name: 'Lume',
    normalizedDomain: 'lume.design',
    destinationUrl: 'https://lume.design',
    contactEmail: 'team@lume.design',
    logoSvg: LUME_LOGO,
    tagline: 'BRIGHTER BRANDS',
    moderationStatus: 'approved',
    rank: 6,
    eligibleSpend: 2800,
    earliestExpiry: '2026-09-13T00:00:00Z',
    impressions: 28900,
    clicks: 620,
    overtakeAmount: 605,
    createdAt: '2026-09-04T00:00:00Z',
  },
  {
    id: 'brand-7',
    name: 'Flowly',
    normalizedDomain: 'flowly.app',
    destinationUrl: 'https://flowly.app',
    contactEmail: 'hi@flowly.app',
    logoSvg: FLOWLY_LOGO,
    tagline: 'WEBSITES THAT FLOW',
    moderationStatus: 'approved',
    rank: 7,
    eligibleSpend: 2100,
    earliestExpiry: '2026-09-11T00:00:00Z',
    impressions: 25300,
    clicks: 480,
    overtakeAmount: 705,
    createdAt: '2026-09-03T00:00:00Z',
  },
  {
    id: 'brand-8',
    name: 'Greenhost',
    normalizedDomain: 'greenhost.net',
    destinationUrl: 'https://greenhost.net',
    contactEmail: 'ads@greenhost.net',
    logoSvg: GREENHOST_LOGO,
    tagline: 'A CLEANER INTERNET',
    moderationStatus: 'approved',
    rank: 8,
    eligibleSpend: 1500,
    earliestExpiry: '2026-09-12T00:00:00Z',
    impressions: 22100,
    clicks: 340,
    overtakeAmount: 605,
    createdAt: '2026-09-05T00:00:00Z',
  },
];

/* ========================================
   Seeded Analysis Results
   ======================================== */

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: 'analysis-1',
    siteId: 'site-1',
    slug: 'gradient-merchant',
    status: 'published',
    siteType: 'Product or SaaS',
    siteTypeConfidence: 0.92,
    captureMode: 'full',
    hostname: 'yourwebsite.com',
    screenshotUrl: '',
    confusionScore: 81,
    trustScore: 64,
    templateScore: 68,
    totalScore: 72,
    diagnoses: [
      {
        category: 'confusion',
        label: 'CONFUSION INDEX',
        score: 81,
        evidence: 'Hero section uses vague language like "Build Without Limits."',
        roast: 'Eight words in and we still don\'t know what you do.',
        fix: 'Replace the hero with a clear value prop that says what you actually offer.',
      },
      {
        category: 'trust',
        label: 'TRUST ISSUES',
        score: 64,
        evidence: 'No customer logos, testimonials, or real social proof above the fold.',
        roast: 'Looks polished, but gives startup-in-weekend vibes.',
        fix: 'Add 2–3 real customer logos and a short, specific testimonial with a real name.',
      },
      {
        category: 'template',
        label: 'TEMPLATE ENERGY',
        score: 68,
        evidence: 'Design, layout, and copy closely match popular templates.',
        roast: 'It looks like every other site on the internet.',
        fix: 'Add original copy, real product screens, or unique proof points that aren\'t template boilerplate.',
      },
    ],
    archetype: 'The Gradient Merchant',
    finalVerdict: 'Eight words, three gradients, and still no clue what you actually sell.',
    shareLine: 'My website is 72% cooked. Can yours beat it?',
    createdAt: '2026-09-10T12:00:00Z',
    completedAt: '2026-09-10T12:00:18Z',
  },
  {
    id: 'analysis-2',
    siteId: 'site-2',
    slug: 'stock-photo-fortress',
    status: 'published',
    siteType: 'Professional service',
    siteTypeConfidence: 0.88,
    captureMode: 'full',
    hostname: 'acmeconsulting.biz',
    screenshotUrl: '',
    confusionScore: 58,
    trustScore: 72,
    templateScore: 85,
    totalScore: 70,
    diagnoses: [
      {
        category: 'confusion',
        label: 'CONFUSION INDEX',
        score: 58,
        evidence: 'The H1 says "Transforming businesses through innovative solutions" with no specifics.',
        roast: 'You transform businesses. Into what? You don\'t say.',
        fix: 'Name the exact industry, service, and one measurable result in the headline.',
      },
      {
        category: 'trust',
        label: 'TRUST ISSUES',
        score: 72,
        evidence: 'Team photos appear to be stock images. No case studies or client references.',
        roast: 'Your team page has more stock photos than a Getty Images search for "business."',
        fix: 'Use real team photos. Add one detailed case study with specific outcomes.',
      },
      {
        category: 'template',
        label: 'TEMPLATE ENERGY',
        score: 85,
        evidence: 'Three-column feature grid, centered text blocks, and a generic contact form match common templates.',
        roast: 'This site was born from a template and hasn\'t left the nest.',
        fix: 'Break the three-column grid. Show your actual work instead of describing it in rounded cards.',
      },
    ],
    archetype: 'The Stock Photo Fortress',
    finalVerdict: 'Corporate jargon wrapped in a template, served with stock photography.',
    shareLine: 'My website is 70% cooked. Can yours beat it?',
    createdAt: '2026-09-10T10:00:00Z',
    completedAt: '2026-09-10T10:00:22Z',
  },
  {
    id: 'analysis-3',
    siteId: 'site-3',
    slug: 'minimalist-ghost',
    status: 'published',
    siteType: 'Portfolio or personal site',
    siteTypeConfidence: 0.95,
    captureMode: 'full',
    hostname: 'janedesigner.com',
    screenshotUrl: '',
    confusionScore: 22,
    trustScore: 28,
    templateScore: 35,
    totalScore: 28,
    diagnoses: [
      {
        category: 'confusion',
        label: 'CONFUSION INDEX',
        score: 22,
        evidence: 'Clear H1 stating "Product Designer at Spotify" with 4 visible case studies.',
        roast: 'Actually clear about who you are. Suspiciously professional for this oven.',
        fix: 'Add a one-line bio beneath the headline for visitors who don\'t know Spotify.',
      },
      {
        category: 'trust',
        label: 'TRUST ISSUES',
        score: 28,
        evidence: 'Real company name, real projects, but no testimonials or measurable outcomes.',
        roast: 'We believe you work there, but did anything you designed actually ship?',
        fix: 'Add one metric or testimonial per project to prove impact.',
      },
      {
        category: 'template',
        label: 'TEMPLATE ENERGY',
        score: 35,
        evidence: 'Clean grid layout with original work samples. Slight similarity to common portfolio templates.',
        roast: 'Minimal but not memorable. The design version of a white T-shirt.',
        fix: 'Add one unique interaction or layout choice that visitors will remember.',
      },
    ],
    archetype: 'The Minimalist Ghost',
    finalVerdict: 'Clean, competent, and forgettable in the best possible way.',
    shareLine: 'My website is 28% cooked. Can yours beat it?',
    createdAt: '2026-09-10T14:00:00Z',
    completedAt: '2026-09-10T14:00:12Z',
  },
];

/* ========================================
   Seeded Leaderboard
   ======================================== */

export const MOCK_LEADERBOARD_MOST: LeaderboardEntry[] = [
  { rank: 1, hostname: 'acmeconsulting.biz', totalScore: 88, archetype: 'The Buzzword Machine', shareLine: 'My website is 88% cooked.', slug: 'buzzword-machine', completedAt: '2026-09-10T08:00:00Z' },
  { rank: 2, hostname: 'fastcrypto.io', totalScore: 85, archetype: 'The Trust Vacuum', shareLine: 'My website is 85% cooked.', slug: 'trust-vacuum', completedAt: '2026-09-10T09:00:00Z' },
  { rank: 3, hostname: 'myportfolio2024.com', totalScore: 82, archetype: 'The Template Tourist', shareLine: 'My website is 82% cooked.', slug: 'template-tourist', completedAt: '2026-09-10T07:30:00Z' },
  { rank: 4, hostname: 'synergysolutions.co', totalScore: 79, archetype: 'The Jargon Jungle', shareLine: 'My website is 79% cooked.', slug: 'jargon-jungle', completedAt: '2026-09-10T11:00:00Z' },
  { rank: 5, hostname: 'bestdeals4u.shop', totalScore: 76, archetype: 'The Popup Factory', shareLine: 'My website is 76% cooked.', slug: 'popup-factory', completedAt: '2026-09-10T06:00:00Z' },
  { rank: 6, hostname: 'yourwebsite.com', totalScore: 72, archetype: 'The Gradient Merchant', shareLine: 'My website is 72% cooked.', slug: 'gradient-merchant', completedAt: '2026-09-10T12:00:00Z' },
  { rank: 7, hostname: 'acmeconsulting.biz', totalScore: 70, archetype: 'The Stock Photo Fortress', shareLine: 'My website is 70% cooked.', slug: 'stock-photo-fortress', completedAt: '2026-09-10T10:00:00Z' },
  { rank: 8, hostname: 'infiniteloop.dev', totalScore: 68, archetype: 'The Loading Screen', shareLine: 'My website is 68% cooked.', slug: 'loading-screen', completedAt: '2026-09-10T05:00:00Z' },
];

export const MOCK_LEADERBOARD_LEAST: LeaderboardEntry[] = [
  { rank: 1, hostname: 'stripe.com', totalScore: 12, archetype: 'The Quiet Closer', shareLine: 'My website is 12% cooked.', slug: 'quiet-closer', completedAt: '2026-09-10T13:00:00Z' },
  { rank: 2, hostname: 'linear.app', totalScore: 18, archetype: 'The Sharp Tool', shareLine: 'My website is 18% cooked.', slug: 'sharp-tool', completedAt: '2026-09-10T12:30:00Z' },
  { rank: 3, hostname: 'janedesigner.com', totalScore: 28, archetype: 'The Minimalist Ghost', shareLine: 'My website is 28% cooked.', slug: 'minimalist-ghost', completedAt: '2026-09-10T14:00:00Z' },
  { rank: 4, hostname: 'vercel.com', totalScore: 31, archetype: 'The Speed Demon', shareLine: 'My website is 31% cooked.', slug: 'speed-demon', completedAt: '2026-09-10T11:30:00Z' },
  { rank: 5, hostname: 'posthog.com', totalScore: 35, archetype: 'The Open Book', shareLine: 'My website is 35% cooked.', slug: 'open-book', completedAt: '2026-09-10T10:30:00Z' },
];

/* ========================================
   Cooking stages
   ======================================== */

export const COOKING_STAGES = [
  { id: 'reading', label: 'Reading the fine print' },
  { id: 'looking', label: 'Looking for proof' },
  { id: 'measuring', label: 'Measuring template energy' },
  { id: 'cooking', label: 'Preheating the roast' },
];
