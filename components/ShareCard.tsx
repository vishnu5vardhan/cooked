import React from 'react';
import styles from './ShareCard.module.css';
import { Analysis, Brand } from '@/lib/types';
import { getScoreBand, formatCurrencyFull } from '@/lib/utils';
import { ScoreDial } from './ScoreDial';

interface ShareCardProps {
  analysis: Analysis;
  topSponsor: Brand;
}

export const ShareCard: React.FC<ShareCardProps> = ({ analysis, topSponsor }) => {
  const band = getScoreBand(analysis.totalScore);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.aspectRatioWrapper}>
        <div className={styles.cardContent}>
          
          <div className={styles.leftCol}>
            <div className={styles.brandMark}>COOKED.</div>
            
            <div className={styles.domain}>{analysis.hostname}</div>
            
            <div className={styles.scoreText}>
              <span className={styles.scoreValue}>{analysis.totalScore}%</span> COOKED
            </div>
            
            <div className={styles.bandContainer}>
              <div className={styles.bandBadge}>{band.name.toUpperCase()}</div>
              <div className={styles.bandDesc}>{band.description}</div>
            </div>
            
            <div className={styles.archetype}>{analysis.archetype}</div>
            <div className={styles.verdict}>{analysis.finalVerdict}</div>
            
            <div className={styles.challengeCta}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10" />
                <path d="M12 17a5 5 0 0 0 5-5V7H7v5a5 5 0 0 0 5 5z" />
                <path d="M7 8H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h1" />
                <path d="M17 8h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-1" />
              </svg>
              CAN YOUR WEBSITE BEAT {analysis.totalScore}?
            </div>
          </div>
          
          <div className={styles.rightCol}>
            <div className={styles.scoreDialWrapper}>
              <div className={styles.scoreLabel}>COOKED SCORE</div>
              <ScoreDial score={analysis.totalScore} size="small" animated={false} />
            </div>
            
            {topSponsor && (
              <div className={styles.sponsorPlate}>
                <div className={styles.rankInfo}>
                  <span className={styles.rank}>#{topSponsor.rank}</span>
                  <span className={styles.spend}>{formatCurrencyFull(topSponsor.eligibleSpend)}</span>
                </div>
                <div className={styles.sponsorBrand}>
                  <div 
                    className={styles.sponsorLogo}
                    dangerouslySetInnerHTML={{ __html: topSponsor.logoSvg }}
                  />
                  <div className={styles.sponsorName}>{topSponsor.name}</div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
