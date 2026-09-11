'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
export default function BidSuccessPage() {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('bid');
    if (!id) return;
    const controller = new AbortController();
    let attempts = 0;
    const poll = async () => {
      try {
        const response = await fetch(`/api/bids/${encodeURIComponent(id)}/status`, {signal: controller.signal});
        const data = await response.json();
        setStatus(data.status);
        if (['paid', 'abandoned', 'rejected', 'refunded'].includes(data.status) || ++attempts >= 24) clearInterval(timer);
      } catch { if (!controller.signal.aborted) setStatus('delayed'); }
    };
    const timer = setInterval(poll, 5000); void poll();
    return () => { controller.abort(); clearInterval(timer); };
  }, []);
  const failed = ['abandoned', 'rejected', 'refunded'].includes(status);
  return <main className={styles.main}><section className={styles.panel} aria-live="polite"><p className={styles.kicker}>YOUR HEAT POSITION</p><h1>{status === 'paid' ? 'Your brand is in the oven.' : failed ? 'This position was not activated.' : 'Confirming your payment.'}</h1><p className={styles.copy}>{status === 'paid' ? 'Your contribution is active for seven days. Your position updates with the live sponsor ranking.' : failed ? status === 'refunded' ? 'The payment was refunded. Contact support if it does not appear with your payment provider.' : 'No active placement was created. Contact support before trying another payment.' : 'Your position will appear when payment is confirmed. If you have already paid, please do not pay again. You can return to this page to check.'}</p><p style={{marginTop:24}}><Link href="/bid">View sponsor board →</Link></p></section></main>;
}
