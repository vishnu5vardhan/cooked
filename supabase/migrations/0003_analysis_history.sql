-- Keep share links valid when a site is roasted again. Leaderboards select its latest result.
drop index if exists public.analyses_one_visible_per_site;
alter table public.analyses drop constraint if exists analyses_check;
alter table public.analyses add constraint analyses_publication_completed
  check (status <> 'published' or completed_at is not null);
