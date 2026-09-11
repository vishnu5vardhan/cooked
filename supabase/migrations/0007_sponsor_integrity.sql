alter table public.brands
  add constraint brands_name_length check (char_length(name) between 1 and 20) not valid,
  add constraint brands_tagline_length check (char_length(tagline) <= 48) not valid;

alter table public.bid_intents
  add constraint bid_intents_minimum_amount check (requested_amount >= 10) not valid;

alter table public.contributions
  add column razorpay_refund_id text unique,
  add column razorpay_refund_event_id text unique;

create or replace function public.confirm_cooked_payment(p_order text, p_payment text, p_event text, p_amount integer, p_currency text)
returns void language plpgsql security definer set search_path = public as $$
declare bid public.bid_intents; approved boolean;
begin
  select * into bid from public.bid_intents where razorpay_order_id = p_order for update;
  if not found then raise exception 'Unknown order'; end if;
  if p_currency <> 'USD' or p_amount <> bid.requested_amount * 100 then raise exception 'Payment amount mismatch'; end if;
  if bid.status = 'paid' then return; end if;
  if bid.status <> 'pending' then raise exception 'Order is not pending'; end if;
  select moderation_status = 'approved' into approved from public.brands where id = bid.brand_id for update;
  if not approved then raise exception 'Brand is not approved'; end if;
  insert into public.contributions(brand_id, bid_intent_id, amount_usd, razorpay_payment_id, razorpay_event_id, active_from, active_until)
  values (bid.brand_id, bid.id, bid.requested_amount, p_payment, p_event, now(), now() + interval '7 days');
  update public.bid_intents set status = 'paid' where id = bid.id;
  insert into public.events(event_type, brand_id, metadata) values ('bid_activated', bid.brand_id, jsonb_build_object('bid_id', bid.id));
end; $$;

create or replace function public.refund_cooked_payment(p_payment text, p_refund text, p_event text, p_amount integer)
returns void language plpgsql security definer set search_path = public as $$
declare contribution public.contributions;
begin
  select * into contribution from public.contributions where razorpay_payment_id = p_payment for update;
  if not found then raise exception 'Unknown payment'; end if;
  if contribution.refunded_at is not null then return; end if;
  if p_amount <> contribution.amount_usd * 100 then raise exception 'Only full refunds are supported'; end if;
  update public.contributions set refunded_at = now(), razorpay_refund_id = p_refund, razorpay_refund_event_id = p_event where id = contribution.id;
  update public.bid_intents set status = 'refunded' where id = contribution.bid_intent_id;
end; $$;

revoke all on function public.refund_cooked_payment(text,text,text,integer) from public, anon, authenticated;
grant execute on function public.refund_cooked_payment(text,text,text,integer) to service_role;
