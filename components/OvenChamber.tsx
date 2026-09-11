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
