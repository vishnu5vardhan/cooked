'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Oven from '@/components/Oven';
import { StageIndicator } from '@/components/StageIndicator';
import { EarnedPlacement, PublicBrand } from '@/lib/types';
import styles from '@/app/page.module.css';

const STAGES = [
  { id: 'read', label: 'Reading the fine print' },
  { id: 'proof', label: 'Looking for proof' },
  { id: 'measure', label: 'Measuring template energy' },
  { id: 'cook', label: 'Cooking your website', subLabel: 'Verifying every claim…' },
];

export default function HomeExperience({ challenge, initialBrands, earnedPlacement: initialEarnedPlacement }: { challenge?: {slug: string; hostname: string; totalScore: number}; initialBrands: PublicBrand[]; earnedPlacement: EarnedPlacement | null }) {
  const router = useRouter();
  const [ovenState, setOvenState] = useState<'idle' | 'cooking' | 'complete'>('idle');
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [illuminatedSponsors, setIlluminatedSponsors] = useState<number[]>([]);
  const [brands, setBrands] = useState<PublicBrand[]>(initialBrands);
  const [earnedPlacement, setEarnedPlacement] = useState<EarnedPlacement | null>(initialEarnedPlacement);
  const [error, setError] = useState('');
  const [slow, setSlow] = useState(false);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    const refresh = () => { if (!document.hidden) fetch('/api/leaderboards/sponsors').then((response) => response.json()).then((data) => { setBrands(data.brands ?? []); setEarnedPlacement(data.earnedPlacement ?? null); }).catch(() => undefined); };
    const timer = window.setInterval(refresh, 30_000); document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  useEffect(() => {
    const items = brands.filter((brand) => brand.eligibleSpend > 0).map((brand) => ({ id: brand.id, placement: `oven-${brand.rank}` }));
    if (items.length) fetch('/api/sponsor-impressions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }), keepalive: true }).catch(() => undefined);
  }, [brands]);
  useEffect(() => {
    if (ovenState !== 'cooking') return;
    const slowTimer = window.setTimeout(() => setSlow(true), 25_000);
    const sponsorTimers = [8, 7, 6, 5, 4, 3, 2, 1].map((rank, index) => window.setTimeout(() => setIlluminatedSponsors((current) => [...current, rank]), 1200 + index * 260));
    return () => { clearTimeout(slowTimer); sponsorTimers.forEach(clearTimeout); };
  }, [ovenState]);

  const handleUrlSubmit = useCallback(async (url: string) => {
    if (challenge && url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase() === challenge.hostname.toLowerCase()) { setError('Enter a different website to take on this challenge.'); return; }
    setSubmittedUrl(url); setScreenshot(''); setError(''); setSlow(false); setCached(false); setOvenState('cooking'); setActiveStageIdx(0); setIlluminatedSponsors([]);
    try {
      const response = await fetch('/api/analyses', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/x-ndjson' }, body: JSON.stringify({ url }), signal: AbortSignal.timeout(110_000) });
      if (!response.ok) { const problem = await response.json(); throw new Error(problem.message || 'Could not start the roast.'); }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Connection lost. Please try again.');
      const decoder = new TextDecoder();
      let pending = '';
      let data: { success?: boolean; slug?: string; cached?: boolean } = {};
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });
        const lines = pending.split('\n'); pending = lines.pop()!;
        for (const line of lines) {
          if (!line) continue;
          const event = JSON.parse(line);
          if (typeof event.stage === 'number') setActiveStageIdx(event.stage);
          if (event.screenshot) setScreenshot(event.screenshot);
          if (event.success === false) throw new Error(event.message);
          if (event.success) data = event;
        }
      }
      if (!data.slug) throw new Error('Connection interrupted. Please try again.');
      setCached(Boolean(data.cached));
      setOvenState('complete');
      window.setTimeout(() => router.push(`/r/${data.slug}${challenge && data.slug !== challenge.slug ? `?vs=${encodeURIComponent(challenge.slug)}` : ''}`), data.cached ? 2_000 : 800);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The oven could not finish that roast.');
      setOvenState('idle');
    }
  }, [router, challenge]);

  return <main className={styles.main}>
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.heroText}>
          <h1 className={styles.headline}>{challenge ? `Can your site beat ${challenge.totalScore}?` : "How cooked is your website?"}</h1>
          <p className={styles.subhead}>{challenge && <><strong>{challenge.hostname}</strong> scored {challenge.totalScore}/100. Lower wins. Enter a different site below.<br /><br /></>}Drop the URL. We&apos;ll inspect the evidence, score the damage, and roast what&apos;s actually there.</p>
          <a className={styles.scrollCue} href="/leaderboard">Explore the latest roasts →</a>
          {earnedPlacement ? <a className={styles.earnedPlate} href={earnedPlacement.destinationUrl} target="_blank" rel="noreferrer"><span>THIS WEEK&apos;S EARNED PLATE</span><strong>{earnedPlacement.hostname}</strong><small>{earnedPlacement.totalScore}/100 · Verified score · Ends {new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(earnedPlacement.expiresAt))}</small></a> : <p className={styles.earnedHint}>Score 20 or below with a verified homepage to earn a free plate for 7 days.</p>}
        </div>
        {ovenState === 'cooking' && <div className={styles.timelineContainer}>{STAGES.map((stage, index) => <StageIndicator key={stage.id} label={stage.label} status={activeStageIdx > index ? 'complete' : activeStageIdx === index ? 'active' : 'pending'} subLabel={activeStageIdx === index ? stage.subLabel : undefined} isLast={index === STAGES.length - 1} />)}</div>}
      </div>
      <div className={styles.rightColumn}><Oven screenshot={screenshot} brands={brands} ovenState={ovenState} url={submittedUrl} onUrlSubmit={handleUrlSubmit} currentStage={cached ? 'Warming up yesterday’s damage…' : STAGES[activeStageIdx]?.label} subStage={slow ? 'Still cooking. Some sites are stubborn.' : ovenState === 'complete' ? 'Opening the oven…' : STAGES[activeStageIdx]?.subLabel || 'Inspecting the public homepage…'} illuminatedSponsors={illuminatedSponsors} error={error} /></div>
    </div>
  </main>;
}
