'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LeaderboardEntry } from '@/lib/types';
import styles from './page.module.css';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'least' | 'most'>('most');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/leaderboards/websites?mode=${activeTab}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Leaderboard unavailable');
        const data = await response.json();
        setEntries(data.entries ?? []); setError('');
      })
      .catch(() => {
        if (!controller.signal.aborted) { setEntries([]); setError('The leaderboard could not load. Please refresh to try again.'); }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [activeTab]);

  const hasEntries = entries.length > 0;

  const selectTab = (tab: 'least' | 'most') => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setActiveTab(tab);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <p className={styles.kicker}>LIVE ROAST RANKINGS</p>
          <h1 className={styles.heading}>The Cooked board.</h1>
          <p className={styles.subhead}>The best and worst of the last 24 hours. Lower scores win.</p>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'most' ? styles.activeTab : ''}`}
              onClick={() => selectTab('most')}
              aria-pressed={activeTab === 'most'}
            >
              Most Cooked
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'least' ? styles.activeTab : ''}`}
              onClick={() => selectTab('least')}
              aria-pressed={activeTab === 'least'}
            >
              Least Cooked
            </button>
          </div>
          <div className={styles.periodLabel}>Rolling 24 hours</div>
        </div>
        
        <div className={styles.list} aria-live="polite">
          {isLoading ? (
            <div className={styles.emptyState}>Heating up the leaderboard.</div>
          ) : error ? <p role="alert" className={styles.emptyState}>{error}</p> : !hasEntries ? (
            <div className={styles.emptyState}>
              The oven is still warming up. No roasts yet.
            </div>
          ) : (
            <>
              <div className={styles.columnHeaders}>
                <div className={styles.rankHeader}>Rank</div>
                <div className={styles.domainHeader}>Website</div>
                <div className={styles.scoreHeader}>Score</div>
              </div>
              {entries.map((entry, index) => (
                <Link 
                  href={`/r/${entry.slug}`} 
                  key={entry.slug || index} 
                  className={styles.row}
                >
                <div className={styles.rank}>{entry.rank.toString().padStart(2, '0')}</div>
                <div className={styles.domain}>{entry.hostname}</div>
                <div className={styles.archetype}>{entry.archetype || 'Unknown'}</div>
                <div className={styles.score}>
                  {entry.totalScore}
                </div>
              </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
