/* Raster logos are validated before storage; never execute sponsor-provided SVG markup. */
export function BrandLogo({ source, name }: { source: string; name: string }) {
  if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(source)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={source} alt={`${name} logo`} width={64} height={64} style={{objectFit: 'contain', width: '100%', height: '100%'}} />;
}
