import styles from './BrowserCard.module.css';

interface BrowserCardProps {
  url: string;
  screenshot?: string;
  className?: string;
}

export function BrowserCard({ url, className, screenshot }: BrowserCardProps) {
  return (
    <div className={`${styles.browserCard} ${className || ''}`}>
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <div className={styles.dotRed}></div>
          <div className={styles.dotYellow}></div>
          <div className={styles.dotGreen}></div>
        </div>
        <div className={styles.urlBar}>{url}</div>
        <div className={styles.spacer}></div>
      </div>
      {screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={screenshot} alt="Captured homepage" style={{width:'100%', minHeight:0, objectFit:'cover', objectPosition:'top'}} />
      ) : <div className={styles.content}><span style={{fontSize:12, color:'var(--text-secondary)'}}>Reading the public homepage…</span></div>}

    </div>
  );
}
