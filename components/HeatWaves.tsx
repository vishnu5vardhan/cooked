import styles from './HeatWaves.module.css';

interface HeatWavesProps {
  active: boolean;
}

export function HeatWaves({ active }: HeatWavesProps) {
  if (!active) return null;

  return (
    <div className={styles.container}>
      <svg className={`${styles.wave} ${styles.wave1}`} viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10" />
      </svg>
      <svg className={`${styles.wave} ${styles.wave2}`} viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0,10 Q25,20 50,10 T100,10 T150,10 T200,10" />
      </svg>
      <svg className={`${styles.wave} ${styles.wave3}`} viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0,10 Q25,5 50,10 T100,10 T150,10 T200,10" />
      </svg>
    </div>
  );
}
