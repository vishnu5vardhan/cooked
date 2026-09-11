import React from 'react';
import styles from './DiagnosisBand.module.css';
import { Diagnosis } from '@/lib/types';

interface DiagnosisBandProps {
  diagnosis: Diagnosis;
}

const IconConfusion = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconTrust = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconTemplate = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);

export const DiagnosisBand: React.FC<DiagnosisBandProps> = ({ diagnosis }) => {
  const getIcon = () => {
    switch (diagnosis.category) {
      case 'confusion': return <IconConfusion />;
      case 'trust': return <IconTrust />;
      case 'template': return <IconTemplate />;
      default: return <IconConfusion />;
    }
  };

  return (
    <article className={styles.band}>
      <div className={styles.leftCol}>
        <div className={styles.iconContainer}>
          {getIcon()}
        </div>
        <div className={styles.scoreContainer}>
          <span className={styles.score}>{diagnosis.score}</span>
          <span className={styles.maxScore}>/100</span>
        </div>
        <h2 className={styles.categoryName}>
          {diagnosis.category}
        </h2>
      </div>
      <div className={styles.rightCol}>
        <div className={styles.row}>
          <span className={styles.label}>Evidence</span>
          <span className={styles.value}>{diagnosis.evidence}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Roast</span>
          <span className={styles.value}>{diagnosis.roast}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>One fix</span>
          <span className={styles.value}>{diagnosis.fix}</span>
        </div>
      </div>
    </article>
  );
};
