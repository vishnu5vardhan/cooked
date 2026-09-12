'use client';
import { BrandLogo } from '@/components/BrandLogo';

import React from 'react';
import styles from './SponsorPlate.module.css';
import { PublicBrand } from '@/lib/types';
import { formatCurrencyFull } from '@/lib/utils';

interface SponsorPlateProps {
  brand: PublicBrand;
  size: 'large' | 'medium' | 'small';
  illuminated?: boolean;
  onSelect: (brand: PublicBrand) => void;
}

export default function SponsorPlate({ brand, size, illuminated, onSelect }: SponsorPlateProps) {
  const sizeClass = styles[size];
  const illuminatedClass = illuminated ? styles.illuminated : '';

  return (
    <button type="button" onClick={() => onSelect(brand)}
      className={`${styles.plate} ${sizeClass} ${illuminatedClass}`}
      aria-label={`Sponsor position #${brand.rank}: ${brand.name}`}
    >
      {/* Corner rivets */}
      <span className={`${styles.rivet} ${styles.topL}`} />
      <span className={`${styles.rivet} ${styles.topR}`} />
      <span className={`${styles.rivet} ${styles.botL}`} />
      <span className={`${styles.rivet} ${styles.botR}`} />

      <div className={styles.header}>
        <span className={styles.rank}>#{brand.rank}</span>
        <span className={styles.spend}>{formatCurrencyFull(brand.eligibleSpend)}</span>
      </div>

      <div className={styles.content}>
        {brand.logoSvg ? <div className={styles.logoContainer}><BrandLogo source={brand.logoSvg} name={brand.name} /></div> : <div className={`${styles.logoContainer} ${styles.placeholderLogo}`}>YOUR<br />LOGO</div>}
        <div className={styles.name}>{brand.name}</div>
        <div className={styles.tagline}>{brand.tagline}</div>
      </div>
    </button>
  );
}
