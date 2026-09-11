import { BrandLogo } from '@/components/BrandLogo';
import { PublicBrand } from '@/lib/types';
import { formatCurrencyFull } from '@/lib/utils';
import styles from './SponsorRail.module.css';

export function SponsorRail({ brands }: { brands: PublicBrand[] }) {
  return <section className={styles.railContainer} aria-label="Paid heat positions">
    <div className={styles.label}>Paid heat positions · ranked by active seven-day spend</div>
    <div className={styles.scrollWrapper}><div className={styles.sponsorList}>
      {brands.map((brand) => <a key={brand.id} href={`/go/${brand.id}?placement=rail`} className={styles.sponsorCell}>
        <div className={styles.rankInfo}><span className={styles.rank}>#{brand.rank}</span><span className={styles.spend}>{formatCurrencyFull(brand.eligibleSpend)}</span></div>
        <div className={styles.brandInfo}>{brand.logoSvg && <div className={styles.logoContainer} ><BrandLogo source={brand.logoSvg} name={brand.name} /></div>}<div className={styles.brandText}><div className={styles.name}>{brand.name}</div><div className={styles.tagline}>{brand.tagline}</div></div></div>
      </a>)}
    </div></div>
  </section>;
}
