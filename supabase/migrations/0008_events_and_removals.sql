alter table public.events add column dedupe_key text unique;

alter table public.analyses drop constraint analyses_diagnoses_check;
alter table public.analyses add constraint analyses_diagnoses_check check (status <> 'published' or jsonb_array_length(diagnoses) = 3);

create or replace function public.accept_cooked_removal(p_request uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare target uuid;
begin
  select analysis_id into target from public.removal_requests where id = p_request and status = 'open' for update;
  if not found then raise exception 'Open removal request not found'; end if;
  update public.analyses set status = 'hidden', hidden_at = now(), completed_at = null, evidence = '{}'::jsonb, diagnoses = '[]'::jsonb, confusion_score = 0, trust_score = 0, template_score = 0, total_score = 0, archetype = '', final_verdict = '', share_line = '' where id = target;
  update public.sites set latest_screenshot_path = '' where id = (select site_id from public.analyses where id = target);
  update public.removal_requests set status = 'accepted', resolved_at = now() where id = p_request;
  return target;
end; $$;

revoke all on function public.accept_cooked_removal(uuid) from public, anon, authenticated;
grant execute on function public.accept_cooked_removal(uuid) to service_role;
