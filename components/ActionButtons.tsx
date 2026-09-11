'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './ActionButtons.module.css';
export function ActionButtons({ slug, hostname, score }: { slug: string; hostname: string; score: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState('');
  const imageUrl = `/api/share/${encodeURIComponent(slug)}`;
  useEffect(() => {
    const controller = new AbortController();
    fetch(imageUrl, {signal: controller.signal}).then(async r => { if (!r.ok) throw new Error(); return new File([await r.blob()], `cooked-${hostname}.png`, {type:'image/png'}); }).then(setFile).catch(() => {});
    return () => controller.abort();
  }, [imageUrl, hostname]);
  const share = async () => {
    if (file && navigator.canShare?.({files:[file]})) {
      try { await navigator.share({files:[file], title:`${hostname} is ${score}% cooked`, text:`Can your site beat ${score}? ${window.location.origin}/challenge/${slug}`}); return; }
      catch (error) { if (error instanceof DOMException && error.name === 'AbortError') return; }
    }
    await copy();
  };
  const copy = async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/r/${slug}`); setMessage('Result link copied.'); } catch { setMessage('Copy the page address to share this result.'); } };
  return <>
    <div className={styles.buttonGroup}>
      <button className={`${styles.button} ${styles.primary}`} onClick={() => dialog.current?.showModal()}><span aria-hidden="true">↥</span> Share the damage</button>
      <Link className={`${styles.button} ${styles.secondary}`} href={`/challenge/${slug}`}><span aria-hidden="true">♜</span> Challenge a website</Link>
      <Link className={`${styles.button} ${styles.secondary}`} href="/"><span aria-hidden="true">↻</span> Roast another</Link>
    </div>
    <dialog ref={dialog} className={styles.shareDialog} aria-label="Share your score card">
      <div className={styles.dialogHeader}><h2>Share the damage.</h2><button className={styles.button} onClick={() => dialog.current?.close()} aria-label="Close share dialog">✕</button></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={`${hostname}: ${score}% cooked share card`} width={1200} height={630} />
      <div className={styles.buttonGroup}><button className={`${styles.button} ${styles.primary}`} disabled={!file} onClick={() => void share()}>Share image</button><a className={`${styles.button} ${styles.primary}`} href={imageUrl} download={`cooked-${hostname}.png`}>Download score card</a><button className={`${styles.button} ${styles.secondary}`} onClick={() => void copy()}>Copy result link</button></div>
      <p role="status">{message || 'Post the image. Let another website take the challenge.'}</p>
    </dialog>
  </>;
}
