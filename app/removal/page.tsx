'use client';

import { FormEvent, use, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/bid/page.module.css';

export default function RemovalPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const { result = '' } = use(searchParams);
  const [slug, setSlug] = useState(result); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage(''); const form = new FormData(event.currentTarget);
    try { const response = await fetch('/api/removal-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, contact: form.get('contact'), reason: form.get('reason') }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setMessage(`Request ${data.requestId} received. We review removals within one business day.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not submit this request.'); }
    finally { setBusy(false); }
  };
  return <main className={styles.main}><section className={styles.panel}><p className={styles.kicker}>PUBLIC RESULT REVIEW</p><h1>Report or request removal</h1><p className={styles.copy}>Tell us what is wrong and how to reach you. Accepted removals disappear from results, comparisons, cards, and leaderboards.</p><form className={styles.form} onSubmit={submit}><label>Result ID<input required pattern="[a-z0-9-]+" value={slug} onChange={(event) => setSlug(event.target.value)} /></label><label>Contact email or URL<input required name="contact" maxLength={200} /></label><label style={{gridColumn:'1 / -1'}}>Reason<textarea required name="reason" minLength={10} maxLength={2000} rows={6} /></label><button disabled={busy} style={{gridColumn:'1 / -1'}}>{busy ? 'Submitting...' : 'Submit request'}</button></form><p role="status" className={styles.copy}>{message}</p><p><Link href={slug ? `/r/${slug}` : '/'}>Back to Cooked</Link></p></section></main>;
}
