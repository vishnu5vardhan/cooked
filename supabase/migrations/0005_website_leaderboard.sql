create or replace function public.cooked_website_leaderboard(p_mode text)
returns table(slug text, hostname text, total_score smallint, archetype text, share_line text, completed_at timestamptz)
language sql stable security definer set search_path = public as $$
  with latest as (
    select distinct on (a.site_id) a.slug, s.hostname, a.total_score, a.archetype, a.share_line, a.completed_at
    from public.analyses a join public.sites s on s.id = a.site_id
    where a.status = 'published' and a.hidden_at is null and a.completed_at > now() - interval '24 hours' and a.completed_at <= now()
    order by a.site_id, a.completed_at desc, a.slug
  )
  select * from latest
  order by case when p_mode = 'least' then total_score else -total_score end, completed_at, hostname
  limit 20;
$$;
revoke all on function public.cooked_website_leaderboard(text) from public, anon, authenticated;
grant execute on function public.cooked_website_leaderboard(text) to service_role;
