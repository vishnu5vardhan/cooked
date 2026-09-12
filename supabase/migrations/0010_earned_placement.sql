-- A single free promotion is earned by a verified, exceptionally clear homepage.
-- It is intentionally separate from the eight paid heat positions and cannot affect a roast.
create table public.earned_placements (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null unique references public.analyses(id) on delete cascade,
  active boolean not null default true,
  activated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (expires_at > activated_at)
);

create unique index earned_placements_one_active
  on public.earned_placements ((active))
  where active;

alter table public.earned_placements enable row level security;

create or replace function public.claim_cooked_earned_placement(p_analysis uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare candidate uuid;
begin
  -- Serializes simultaneous successful roasts so only one eligible site gets the slot.
  perform pg_advisory_xact_lock(hashtext('cooked-earned-placement'));
  update public.earned_placements set active = false where active and expires_at <= now();
  if exists (select 1 from public.earned_placements where active) then return false; end if;

  select a.id into candidate
  from public.analyses a
  where a.id = p_analysis
    and a.status = 'published'
    and a.hidden_at is null
    and a.capture_mode = 'full'
    and a.total_score <= 20;
  if not found then return false; end if;

  insert into public.earned_placements(analysis_id, expires_at)
  values (candidate, now() + interval '7 days');
  return true;
end; $$;

create or replace function public.cooked_earned_placement()
returns table(analysis_id uuid, slug text, hostname text, destination_url text, total_score smallint, expires_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.analysis_id, a.slug, s.hostname, s.normalized_origin, a.total_score, p.expires_at
  from public.earned_placements p
  join public.analyses a on a.id = p.analysis_id
  join public.sites s on s.id = a.site_id
  where p.active and p.expires_at > now() and a.status = 'published' and a.hidden_at is null
  order by p.activated_at desc
  limit 1;
$$;

-- A removed result must disappear from every public surface, including free promotion.
create or replace function public.accept_cooked_removal(p_request uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare target uuid;
begin
  select analysis_id into target from public.removal_requests where id = p_request and status = 'open' for update;
  if not found then raise exception 'Open removal request not found'; end if;
  update public.earned_placements set active = false where analysis_id = target and active;
  update public.analyses set status = 'hidden', hidden_at = now(), completed_at = null, evidence = '{}'::jsonb, diagnoses = '[]'::jsonb, confusion_score = 0, trust_score = 0, template_score = 0, total_score = 0, archetype = '', final_verdict = '', share_line = '' where id = target;
  update public.sites set latest_screenshot_path = '' where id = (select site_id from public.analyses where id = target);
  update public.removal_requests set status = 'accepted', resolved_at = now() where id = p_request;
  return target;
end; $$;

revoke all on function public.claim_cooked_earned_placement(uuid) from public, anon, authenticated;
grant execute on function public.claim_cooked_earned_placement(uuid) to service_role;
revoke all on function public.cooked_earned_placement() from public, anon, authenticated;
grant execute on function public.cooked_earned_placement() to service_role;
