import { BrowserCard } from '@/components/BrowserCard';
import { BrandLogo } from '@/components/BrandLogo';
import { notFound } from 'next/navigation';
import { getAnalysisBySlug } from '@/lib/roast-engine';
import { getRankedBrands } from '@/lib/sponsor-engine';
import { getScoreBand, formatCurrencyFull } from '@/lib/utils';
import { ScoreDial } from '@/components/ScoreDial';
import { DiagnosisBand } from '@/components/DiagnosisBand';
import { ActionButtons } from '@/components/ActionButtons';
import { SponsorRail } from '@/components/SponsorRail';

import styles from './page.module.css';

export const metadata = { robots: { index: false, follow: false } };

export const dynamic = 'force-dynamic';

export default async function ResultPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{vs?: string}> }) {
  const { slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) notFound();
  const {vs} = await searchParams;
  const opponent = vs && vs !== slug ? await getAnalysisBySlug(vs) : null;
  const band = getScoreBand(analysis.totalScore);
  const sponsors = await getRankedBrands();
  const topSponsor = sponsors[0];
  return <div className={styles.pageContainer}>
    <main className={styles.main}>
      {opponent && <section className={styles.comparison} aria-label="Challenge comparison"><div><span>CHALLENGE RESULT · LOWER WINS</span><h2>{analysis.totalScore === opponent.totalScore ? 'A perfectly cooked tie.' : analysis.totalScore < opponent.totalScore ? `${analysis.hostname} wins.` : `${opponent.hostname} wins.`}</h2></div><p><strong>{analysis.hostname}</strong> {analysis.totalScore}/100 <span>vs</span> <strong>{opponent.hostname}</strong> {opponent.totalScore}/100</p></section>}
      <section className={styles.topSection}>
        <div className={styles.leftCol}>
          <h1 className={styles.heroTitle}>{analysis.hostname} is <span className={styles.highlight}>{analysis.totalScore}%</span> cooked.</h1>
          <div className={styles.bandInfo}><div className={styles.bandBadge}>{band.name.toUpperCase()}</div><div className={styles.bandDesc}>{band.description}</div></div>
          <div className={styles.archetype}>{analysis.archetype}</div>
          <div className={styles.verdict}>{analysis.finalVerdict}</div>
          <div className={styles.actionsWrapper}><ActionButtons slug={analysis.slug} hostname={analysis.hostname} score={analysis.totalScore} /></div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.scoreSection}><div className={styles.scoreLabel}>COOKED SCORE</div><ScoreDial score={analysis.totalScore} size="large" /></div>
          <div className={styles.previewSection}>
            <div className={styles.previewLabel}>ANALYZED HOMEPAGE · {analysis.captureMode === 'text_only' ? 'TEXT-ONLY CAPTURE' : 'SCREENSHOT'}</div>
            <>{analysis.screenshotUrl ? <BrowserCard url={analysis.hostname} screenshot={analysis.screenshotUrl} className={styles.resultCard} /> : <blockquote className={styles.evidencePreview}>{analysis.diagnoses[0].evidence}</blockquote>}</>
            <div className={styles.screenshotMeta}>{analysis.captureMode === 'text_only' ? 'This roast uses the homepage’s public text. Visual appearance was not assessed.' : 'Captured public homepage.'}</div>
          </div>
          {topSponsor && <a className={styles.sponsorPlacement} href={`/go/${topSponsor.id}?placement=result`}>
            <div className={styles.sponsorHeader}><span className={styles.rank}>TOP HEAT · #{topSponsor.rank}</span><span className={styles.spend}>{formatCurrencyFull(topSponsor.eligibleSpend)}</span></div>
            <div className={styles.sponsorBrand}>{topSponsor.logoSvg && <div className={styles.sponsorLogo} ><BrandLogo source={topSponsor.logoSvg} name={topSponsor.name} /></div>}<div className={styles.sponsorText}><div className={styles.sponsorName}>{topSponsor.name}</div><div className={styles.sponsorTagline}>{topSponsor.tagline}</div></div></div>
          </a>}
        </div>
      </section>
      <section className={styles.diagnosesSection}>{analysis.diagnoses.map((diagnosis) => <DiagnosisBand key={diagnosis.category} diagnosis={diagnosis} />)}</section>
      <section className={styles.bottomBar}><div className={styles.bottomCta}><div className={styles.challengeCta}>CAN YOUR WEBSITE BEAT {analysis.totalScore}?</div><div className={styles.challengeDesc}>Lower Cooked Score wins. Put your homepage in the oven.</div></div><ActionButtons slug={analysis.slug} hostname={analysis.hostname} score={analysis.totalScore} /></section>
      <SponsorRail brands={sponsors} />
      <a className={styles.removalLink} href={`/removal?result=${encodeURIComponent(analysis.slug)}`}>Report or request removal</a>
    </main>
  </div>;
}
