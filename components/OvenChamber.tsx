'use client';

import React from 'react';
import styles from './OvenChamber.module.css';
import { BrowserCard } from './BrowserCard';
import { HeatWaves } from './HeatWaves';

interface OvenChamberProps {
  state: 'idle' | 'cooking' | 'complete';
  url?: string;
  screenshot?: string;
  children?: React.ReactNode;
}

export default function OvenChamber({ state, url, screenshot, children }: OvenChamberProps) {
  const isCooking = state === 'cooking';

  return (
    <div className={`${styles.chamberOuter} ${isCooking ? styles.cookingState : ''} ${state === 'complete' ? styles.completeState : ''}`}>
      {/* Outer frame side handles */}
      <div className={`${styles.handle} ${styles.handleLeft}`} />
      <div className={`${styles.handle} ${styles.handleRight}`} />

      {/* Frame rivets */}
      <span className={`${styles.screw} ${styles.screwTopL}`} />
      <span className={`${styles.screw} ${styles.screwTopR}`} />
      <span className={`${styles.screw} ${styles.screwBotL}`} />
      <span className={`${styles.screw} ${styles.screwBotR}`} />

        <div className={`${styles.glassWindow} ${state === 'cooking' ? styles.doorClosing : state === 'complete' ? styles.doorOpening : ''}`}>
        {/* Glowing interior orange border outline */}
        <div className={`${styles.innerGlowBorder} ${isCooking ? styles.activeGlow : ''}`} />
        <div className={styles.heatGradient} />

        {/* Rack wires */}
        <div className={styles.wireRack}>
          <div className={styles.rackBar} />
        </div>

        {state === 'idle' ? (
          <div className={styles.idlePlaque}>
            <span className={`${styles.plaqueScrew} ${styles.pScrewTL}`} />
            <span className={`${styles.plaqueScrew} ${styles.pScrewTR}`} />
            <span className={`${styles.plaqueScrew} ${styles.pScrewBL}`} />
            <span className={`${styles.plaqueScrew} ${styles.pScrewBR}`} />
            <div className={styles.idleText}>GOOD SITES DON&apos;T END UP HERE.</div>
          </div>
        ) : (
          <div className={styles.cookingContent}>
            {isCooking && <svg className={styles.flames} viewBox="0 0 180 72" aria-hidden="true">
              <path className={styles.flameBack} d="M22 70c-8-24 9-32 18-50 2 17 16 21 10 50M67 70c-7-31 14-38 22-62 4 21 18 28 12 62M119 70c-6-24 9-33 18-50 3 17 17 21 11 50" />
              <path className={styles.flameFront} d="M31 70c-3-13 8-19 9-30 9 12 8 21 3 30M77 70c-4-17 9-26 11-39 12 16 9 28 4 39M129 70c-3-12 7-19 9-30 9 12 8 21 3 30" />
            </svg>}
            <div className={styles.cardContainer}>
              <BrowserCard screenshot={screenshot} url={url || 'https://yourwebsite.com'} />
            </div>
            <HeatWaves active={isCooking} />
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
