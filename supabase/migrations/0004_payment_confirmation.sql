-- One transaction per verified payment, including duplicate webhook deliveries.
create or replace function public.confirm_cooked_payment(p_order text, p_payment text, p_event text, p_amount integer, p_currency text)
returns void language plpgsql security definer set search_path = public as $$
declare bid public.bid_intents;
begin
  select * into bid from public.bid_intents where razorpay_order_id = p_order for update;
  if not found then raise exception 'Unknown order'; end if;
  if p_currency <> 'USD' or p_amount <> bid.requested_amount * 100 then raise exception 'Payment amount mismatch'; end if;
  if bid.status = 'paid' then return; end if;
  if bid.status <> 'pending' then raise exception 'Order is not pending'; end if;
  insert into public.contributions(brand_id, bid_intent_id, amount_usd, razorpay_payment_id, razorpay_event_id, active_from, active_until)
  values (bid.brand_id, bid.id, bid.requested_amount, p_payment, p_event, now(), now() + interval '7 days');
  update public.bid_intents set status = 'paid' where id = bid.id;
end; $$;
revoke all on function public.confirm_cooked_payment(text,text,text,integer,text) from public, anon, authenticated;
grant execute on function public.confirm_cooked_payment(text,text,text,integer,text) to service_role;
