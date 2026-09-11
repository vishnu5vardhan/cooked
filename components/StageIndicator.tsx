'use client';

import styles from './StageIndicator.module.css';

interface StageIndicatorProps {
  label: string;
  status: 'pending' | 'active' | 'complete';
  subLabel?: string;
  isLast?: boolean;
}

export function StageIndicator({ label, status, subLabel, isLast }: StageIndicatorProps) {
  return (
    <div className={`${styles.item} ${styles[status]}`}>
      <div className={styles.leftCol}>
        <div className={styles.iconNode}>
          {status === 'complete' && (
            <div className={styles.circleComplete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          )}
          {status === 'active' && (
            <div className={styles.circleActive} />
          )}
          {status === 'pending' && (
            <div className={styles.circlePending} />
          )}
        </div>
        {!isLast && <div className={`${styles.line} ${status !== 'pending' ? styles.lineActive : ''}`} />}
      </div>

      <div className={styles.rightCol}>
        <div className={styles.label}>{label}</div>
        {subLabel && <div className={styles.subLabel}>{subLabel}</div>}
      </div>
    </div>
  );
}

