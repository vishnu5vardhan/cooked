'use client';

import React, { useState } from 'react';
import styles from './URLConsole.module.css';

interface URLConsoleProps {
  onSubmit: (url: string) => void;
  state: 'idle' | 'cooking' | 'complete';
  currentStage?: string;
  subStage?: string;
  error?: string;
}

export default function URLConsole({ onSubmit, state, currentStage, subStage, error }: URLConsoleProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  if (state !== 'idle') {
    return (
      <div className={styles.consoleCooking} role="status" aria-live="polite" aria-atomic="true">
        <div className={styles.statusBar}>
          <div className={state === 'complete' ? styles.completeMark : styles.spinner}>{state === 'complete' ? '✓' : null}</div>
          <div className={styles.divider} />
          <div className={styles.statusTextGroup}>
            <div className={styles.mainStatus}>{currentStage || 'Cooking your website...'}</div>
            <div className={styles.subStatus}>{subStage || 'Measuring template energy'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.console}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <div className={styles.iconCircle}>
            <svg 
              className={styles.icon} 
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <label htmlFor="website-url" className={styles.srOnly}>Public website URL</label>
          <input
            id="website-url"
            type="text"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            className={styles.input}
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Roast my site <span className={styles.arrow}>→</span>
        </button>
      </form>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
