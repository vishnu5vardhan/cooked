/* Raster and SVG data URIs are validated/encoded before storage; SVGs render inside <img>, which never executes script. */
export function BrandLogo({ source, name }: { source: string; name: string }) {
  const value = source.trimStart();
  if (value.startsWith('<svg')) {
    // Allow raw mock SVGs to render in local previews and seeded data.
    const encoded = encodeURIComponent(value);
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`data:image/svg+xml;charset=utf-8,${encoded}`} alt={`${name} logo`} width={64} height={64} style={{objectFit: 'contain', width: '100%', height: '100%'}} />;
  }
  if (!/^data:image\/(png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(value)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={value} alt={`${name} logo`} width={64} height={64} style={{objectFit: 'contain', width: '100%', height: '100%'}} />;
}
