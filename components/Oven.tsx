'use client';

import React, { useRef, useState } from 'react';
import styles from './Oven.module.css';
import SponsorPlate from './SponsorPlate';
import OvenChamber from './OvenChamber';
import URLConsole from './URLConsole';
import { PublicBrand } from '@/lib/types';
import BidForm from './BidForm';

interface OvenProps {
  brands: PublicBrand[];
  screenshot?: string;
  ovenState: 'idle' | 'cooking' | 'complete';
  onUrlSubmit: (url: string) => void;
  url?: string;
  currentStage?: string;
  subStage?: string;
  illuminatedSponsors?: number[];
  error?: string;
}

export default function Oven({ 
  brands, screenshot, 
  ovenState, 
  onUrlSubmit, 
  url,
  currentStage, 
  subStage,
  illuminatedSponsors = [],
  error,
}: OvenProps) {
  const details = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<PublicBrand>();
  const [bidding, setBidding] = useState(false);
  const inspect = (brand: PublicBrand) => { setSelected(brand); setBidding(brand.eligibleSpend === 0); details.current?.showModal(); };
  const getBrand = (index: number): PublicBrand => {
    if (brands[index]) return brands[index];
    return {
      id: `placeholder-${index}`,
      rank: index + 1,
      name: 'Available',
      normalizedDomain: '',
      destinationUrl: '#',
      tagline: 'Claim this spot',
      logoSvg: '',
      eligibleSpend: 0,
      earliestExpiry: '',
      impressions: 0,
      clicks: 0,
      overtakeAmount: 10,
    };
  };

  const brand1 = getBrand(0);
  const brand2 = getBrand(1);
  const brand3 = getBrand(2);
  const smallBrands = [getBrand(3), getBrand(4), getBrand(5), getBrand(6), getBrand(7)];

  return (
    <div className={styles.ovenWrapper} aria-busy={ovenState === 'cooking'}>
      {/* Top Chimney */}
      <div className={styles.chimney}>
        <div className={styles.ventSlits}>
          <div className={styles.ventSlit} />
          <div className={styles.ventSlit} />
          <div className={styles.ventSlit} />
        </div>
      </div>
      
      {/* Machine Chassis Structure */}
      <div className={styles.machineChassis}>
        {/* Tier 1: #1 Top Sponsor Housing with Shoulder Wings */}
        <div className={styles.tier1Housing}>
          <div className={styles.shoulderWingLeft} />
          <div className={styles.topPlateContainer}>
            <SponsorPlate 
              brand={brand1} 
              size="large" 
              illuminated={illuminatedSponsors.includes(1)}
              onSelect={inspect}
            />
          </div>
          <div className={styles.shoulderWingRight} />
        </div>

        {/* Tier 2: #2 Plate + Central Chamber + #3 Plate */}
        <div className={styles.tier2Housing}>
          <span className={`${styles.screw} ${styles.screwT2TL}`} />
          <span className={`${styles.screw} ${styles.screwT2TR}`} />
          <span className={`${styles.screw} ${styles.screwT2BL}`} />
          <span className={`${styles.screw} ${styles.screwT2BR}`} />

          <div className={styles.plate2}>
            <SponsorPlate 
              brand={brand2} 
              size="medium" 
              illuminated={illuminatedSponsors.includes(2)}
              onSelect={inspect}
            />
          </div>
          
          <div className={styles.chamberWrapper}>
            <OvenChamber state={ovenState} url={url} screenshot={screenshot} />
          </div>

          <div className={styles.plate3}>
            <SponsorPlate 
              brand={brand3} 
              size="medium" 
              illuminated={illuminatedSponsors.includes(3)}
              onSelect={inspect}
            />
          </div>
        </div>

        {/* Tier 3: URL Console Row */}
        <div className={styles.tier3ConsoleHousing}>
          <span className={`${styles.screw} ${styles.screwConsoleL}`} />
          <span className={`${styles.screw} ${styles.screwConsoleR}`} />

          <URLConsole 
            state={ovenState} 
            onSubmit={onUrlSubmit} 
            currentStage={currentStage} 
            subStage={subStage}
            error={error}
          />
        </div>

        {/* Tier 4: Bottom Sponsor Rail Housing (#4 to #8) */}
        <div className={styles.tier4RailHousing}>
          <span className={`${styles.screw} ${styles.screwT4TL}`} />
          <span className={`${styles.screw} ${styles.screwT4TR}`} />
          <span className={`${styles.screw} ${styles.screwT4BL}`} />
          <span className={`${styles.screw} ${styles.screwT4BR}`} />

          <div className={styles.rail}>
            {smallBrands.map((brand) => (
              <SponsorPlate 
                key={brand.rank}
                brand={brand} 
                size="small" 
                illuminated={illuminatedSponsors.includes(brand.rank)}
                onSelect={inspect}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Base Metal Feet */}
      <div className={styles.baseFeet}>
        <div className={styles.foot} />
        <div className={styles.foot} />
      </div>
      <dialog ref={details} className={styles.sponsorDialog} aria-labelledby="sponsor-title">
        <div className={styles.dialogHeader}><span>PAID HEAT POSITION</span><button type="button" onClick={() => details.current?.close()} aria-label="Close sponsor details">X</button></div>
        {selected && bidding ? <BidForm key={selected.rank} initialRank={selected.rank} embedded /> : selected && <div className={styles.dialogBody}>
          <h2 id="sponsor-title">#{selected.rank} {selected.name}</h2>
          <p>{selected.tagline || (selected.eligibleSpend ? selected.normalizedDomain : 'This heat position is available.')}</p>
          <dl><div><dt>Seven-day spend</dt><dd>${selected.eligibleSpend.toLocaleString()}</dd></div><div><dt>Earliest expiry</dt><dd>{selected.earliestExpiry ? new Date(selected.earliestExpiry).toLocaleString() : 'No active spend'}</dd></div><div><dt>Impressions / clicks</dt><dd>{selected.impressions.toLocaleString()} / {selected.clicks.toLocaleString()}</dd></div><div><dt>Takeover payment</dt><dd>From ${selected.overtakeAmount.toLocaleString()}</dd></div></dl>
          <p className={styles.disclosure}>Positions are paid and ranked by active seven-day spend. Contributions normally cannot be refunded and expire from ranking after seven days.</p>
          <div className={styles.dialogActions}>{selected.eligibleSpend > 0 && <a href={`/go/${selected.id}?placement=oven-${selected.rank}`}>Visit brand</a>}<button type="button" onClick={() => setBidding(true)}>Take this position</button></div>
        </div>}
      </dialog>
    </div>
  );
}
