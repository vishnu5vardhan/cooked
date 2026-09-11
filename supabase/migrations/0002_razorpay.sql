-- Upgrade databases created before Razorpay replaced Stripe. Fresh installs already use these names.
do $$ begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'bid_intents' and column_name = 'stripe_checkout_session_id') then
    alter table public.bid_intents rename column stripe_checkout_session_id to razorpay_order_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'contributions' and column_name = 'stripe_payment_intent_id') then
    alter table public.contributions rename column stripe_payment_intent_id to razorpay_payment_id;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'contributions' and column_name = 'stripe_event_id') then
    alter table public.contributions rename column stripe_event_id to razorpay_event_id;
  end if;
end $$;
