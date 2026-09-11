import OpenGraphImage from '@/app/r/[slug]/opengraph-image';
export async function GET(_request: Request, context: {params: Promise<{slug: string}>}) {
  return OpenGraphImage(context);
}
