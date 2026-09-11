import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          COOKED<span className={styles.dot}>.</span>
        </Link>
        <div className={styles.actions}>
          <Link href="/leaderboard" className={styles.link}>
            Leaderboard
          </Link>
          <Link href="/bid" className={styles.link}>
            Buy a sponsor ad
          </Link>
        </div>
      </div>
    </header>
  );
}
