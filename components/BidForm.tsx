'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/bid/page.module.css';

type Quote = { isEligible: boolean; minimumRequired: number; currentRankSpend: number; currentEligibleSpend: number; projectedRank: number; earliestExpiry: string; quoteExpiresAt: string; message: string };
type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayOptions = { key: string; amount: number; currency: string; name: string; description: string; order_id: string; handler: (response: RazorpayResponse) => void | Promise<void>; modal?: { ondismiss: () => void } };
type RazorpayCheckout = { open: () => void; on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout } }

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true;
    script.onload = () => window.Razorpay ? resolve() : reject(new Error('Razorpay did not load.'));
    script.onerror = () => reject(new Error('Razorpay could not load.'));
    document.head.append(script);
  });
}

export default function BidForm({initialRank, embedded = false}: {initialRank: number; embedded?: boolean}) {
  const router = useRouter();
  const [rank, setRank] = useState(initialRank);
  const [busy, setBusy] = useState(false);
  const [brands, setBrands] = useState<Array<{id: string; name: string; rank: number; eligibleSpend: number}>>([]);
  const [form, setForm] = useState({ name: '', destinationUrl: '', contactEmail: '', tagline: '', logo: '' });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/leaderboards/sponsors').then(r => r.json()).then(data => setBrands(data.brands ?? [])).catch(() => setError('Sponsor rankings could not load. Please refresh.'));
  }, []);
  const change = (key: keyof typeof form, value: string) => { setQuote(null); setForm((current) => ({ ...current, [key]: value })); };
  const requestQuote = async () => {
    const response = await fetch('/api/bids/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, targetRank: rank }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not calculate your position.');
    setQuote(data.quote);
  };
  const checkout = async (event: FormEvent) => {
    event.preventDefault(); if (busy) return; setError(''); setBusy(true);
    let opened = false;
    try {
      if (!quote) { await requestQuote(); return; }
      const response = await fetch('/api/bids/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, targetRank: rank }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not start Razorpay.');
      await loadRazorpay();
      const checkout = new window.Razorpay!({
        key: data.keyId, amount: data.amount, currency: data.currency, name: 'Cooked.', description: 'Seven-day heat position', order_id: data.orderId,
        handler: () => {
          // Razorpay's webhook is the activation authority; do not make the confirmation page depend on another browser request.
          router.push(`/bid/success?bid=${encodeURIComponent(data.bidId)}`);
        },
        modal: { ondismiss: () => { setBusy(false); setError('Checkout closed. No new payment was submitted here.'); } },
      });
      checkout.on('payment.failed', (failure) => { setBusy(false); setError(failure.error?.description || 'Payment failed. No position was activated.'); });
      checkout.open(); opened = true;
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not start Razorpay.'); } finally { if (!opened) setBusy(false); }
  };
  const content = <><p className={styles.kicker}>PAID HEAT POSITION #{rank}</p><h1>Put your brand in this slot</h1><p className={styles.copy}>Position #{rank} starts at ${10 + (8 - rank) * 5}. Occupied slots automatically include the amount needed to outbid them by $5.</p>
    {!embedded && <div className={styles.positions} aria-label="Current sponsor rankings">{Array.from({length: 8}, (_, i) => { const brand = brands.find(b => b.rank === i + 1); return <button type="button" key={i} aria-pressed={rank === i + 1} onClick={() => { setRank(i + 1); setQuote(null); }}><span>#{i + 1}</span><strong>{brand?.name || 'Available'}</strong><span>{brand ? `$${brand.eligibleSpend.toLocaleString()}` : `From $${10 + (7 - i) * 5}`}</span></button>; })}</div>}
    <form onSubmit={checkout} className={styles.form}>
      {!embedded && <label>Target rank<select value={rank} onChange={(event) => { setRank(Number(event.target.value)); setQuote(null); }}>{Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={index + 1}>Rank #{index + 1}</option>)}</select></label>}
      <label>Brand name<input required maxLength={20} value={form.name} onChange={(event) => change('name', event.target.value)} /></label>
      <label>Website URL<input type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" required placeholder="https://brand.com" value={form.destinationUrl} onChange={(event) => change('destinationUrl', event.target.value)} /></label>
      <label>Contact email <span>(optional)</span><input type="email" value={form.contactEmail} onChange={(event) => change('contactEmail', event.target.value)} /></label>
      <label>Square logo · PNG, JPEG or WebP<input type="file" accept="image/png,image/jpeg,image/webp" onChange={async event => {
        const file = event.target.files?.[0]; if (!file) return;
        if (file.size > 250_000 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setError('Use a PNG, JPEG or WebP under 250 KB.'); return; }
        const source = URL.createObjectURL(file); const image = new Image();
        image.onload = () => { URL.revokeObjectURL(source); const reader = new FileReader(); reader.onload = () => change('logo', String(reader.result)); reader.readAsDataURL(file); }; image.onerror = () => { URL.revokeObjectURL(source); setError('That logo could not be read.'); }; image.src = source;
      }} /></label>
      <label>Short tagline <span>(optional)</span><input maxLength={48} value={form.tagline} onChange={(event) => change('tagline', event.target.value)} /></label>
      <p className={styles.copy} style={{gridColumn: "1 / -1"}}>Paid positions rank by active seven-day spend. Being outranked does not qualify for a refund. Rejected or undeliverable placements are refunded.</p>
      {quote && <div className={styles.quote} role="status" aria-live="polite"><strong>{quote.message}</strong><span>Exact charge: ${quote.minimumRequired.toLocaleString()} for seven active days.</span><span>Occupied positions include the $5 outbid. Rank can change before payment lands.</span>{quote.earliestExpiry && <span>Your earliest existing contribution expires {new Date(quote.earliestExpiry).toLocaleString()}.</span>}</div>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" disabled={busy || Boolean(quote && !quote.isEligible)} style={{gridColumn:'1 / -1'}}>{busy ? 'Please wait…' : quote ? 'Continue to Razorpay' : 'Review my price'}</button>
    </form></>;
  return embedded ? <div className={styles.embedded}>{content}</div> : <main className={styles.main}><section className={styles.panel}>{content}</section></main>;
}
