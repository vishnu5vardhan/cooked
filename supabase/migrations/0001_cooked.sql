-- Cooked's server is the only writer. The browser receives public projections only.
create extension if not exists pgcrypto;

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  normalized_origin text not null unique check (normalized_origin ~ '^https?://'),
  hostname text not null,
  title text not null default '',
  description text not null default '',
  favicon_url text not null default '',
  latest_screenshot_path text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null unique,
  status text not null check (status in ('processing', 'published', 'failed', 'blocked', 'hidden')),
  site_type text not null default '',
  site_type_confidence numeric(4,3) not null default 0 check (site_type_confidence between 0 and 1),
  capture_mode text not null check (capture_mode in ('full', 'text_only', 'vision_only')),
  evidence jsonb not null default '{}'::jsonb,
  diagnoses jsonb not null default '[]'::jsonb check (jsonb_array_length(diagnoses) = 3),
  confusion_score smallint not null check (confusion_score between 0 and 100),
  trust_score smallint not null check (trust_score between 0 and 100),
  template_score smallint not null check (template_score between 0 and 100),
  total_score smallint not null check (total_score between 0 and 100),
  archetype text not null,
  final_verdict text not null,
  share_line text not null,
  model_id text not null,
  prompt_version text not null,
  failure_code text,
  safety_status text not null default 'approved',
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  hidden_at timestamptz,
  check ((status = 'published') = (completed_at is not null))
);

create unique index analyses_one_visible_per_site
  on public.analyses(site_id)
  where status = 'published' and hidden_at is null;
create index analyses_rolling_leaderboard
  on public.analyses(completed_at desc, total_score desc)
  where status = 'published' and hidden_at is null;

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  normalized_domain text not null unique,
  name text not null check (char_length(name) between 1 and 80),
  destination_url text not null check (destination_url ~ '^https://'),
  contact_email text not null,
  logo_path text not null default '',
  tagline text not null default '' check (char_length(tagline) <= 100),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bid_intents (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  requested_amount integer not null check (requested_amount > 0),
  projected_rank smallint not null check (projected_rank between 1 and 8),
  status text not null default 'pending' check (status in ('pending', 'paid', 'abandoned', 'rejected', 'refunded')),
  razorpay_order_id text unique,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  check (expires_at > created_at)
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  bid_intent_id uuid not null unique references public.bid_intents(id) on delete restrict,
  amount_usd integer not null check (amount_usd > 0),
  razorpay_payment_id text unique,
  razorpay_event_id text not null unique,
  active_from timestamptz not null,
  active_until timestamptz not null,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  check (active_until > active_from)
);
create index contributions_active_ranking on public.contributions(active_from, active_until) where refunded_at is null;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('roast_started', 'roast_cache_hit', 'roast_completed', 'roast_failed', 'result_viewed', 'result_shared', 'challenge_opened', 'challenge_completed', 'sponsor_impression', 'sponsor_clicked', 'bid_quote_created', 'checkout_started', 'bid_activated', 'contribution_expired')),
  analysis_id uuid references public.analyses(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  placement text,
  anonymous_session_hash text,
  referrer_domain text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index events_created_at on public.events(created_at desc);

create table public.removal_requests (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  contact text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Public reads are deliberately exposed only through the Next.js server routes.
alter table public.sites enable row level security;
alter table public.analyses enable row level security;
alter table public.brands enable row level security;
alter table public.bid_intents enable row level security;
alter table public.contributions enable row level security;
alter table public.events enable row level security;
alter table public.removal_requests enable row level security;
