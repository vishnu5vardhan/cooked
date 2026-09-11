'use client';

import React, { useEffect, useState } from 'react';
import styles from './ScoreDial.module.css';

interface ScoreDialProps {
  score: number;
  size?: 'large' | 'small';
  animated?: boolean;
}

export const ScoreDial: React.FC<ScoreDialProps> = ({ score, size = 'large', animated = true }) => {
  const [currentScore, setCurrentScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      // Trigger animation after mount
      const timer = setTimeout(() => {
        setCurrentScore(score);
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 100);
      return () => clearTimeout(timer);
    }
  }, [score, animated]);

  // viewBox and dimensions
  const radius = 100;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Calculate dash offset for an arc that spans 270 degrees (3/4 of a circle)
  // Let's just do a full circle for simplicity but dash it so it fills up to score
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className={`${styles.dialContainer} ${styles[size]}`} role="img" aria-label={`Cooked score: ${score} out of 100`}>
      <svg
        aria-hidden="true"
        height="100%"
        width="100%"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className={styles.svg}
      >
        {/* Background track */}
        <circle
          stroke="var(--border)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={styles.track}
        />
        
        {/* Decorative dots at 12, 3, 6, 9 */}
        <circle cx={radius} cy={strokeWidth * 2} r="3" fill="var(--canvas)" />
        <circle cx={radius * 2 - strokeWidth * 2} cy={radius} r="3" fill="var(--canvas)" />
        <circle cx={radius} cy={radius * 2 - strokeWidth * 2} r="3" fill="var(--canvas)" />
        <circle cx={strokeWidth * 2} cy={radius} r="3" fill="var(--canvas)" />

        {/* Score arc */}
        <circle
          stroke="var(--ember)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: animated ? strokeDashoffset : (circumference - (score / 100) * circumference) }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={styles.arc}
        />
      </svg>
      <div className={styles.scoreTextContainer}>
        <span className={styles.score}>{animated ? Math.round(currentScore) : score}</span>
        <span className={styles.maxScore}>/100</span>
      </div>
    </div>
  );
};
