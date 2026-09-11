import { getBidStatus } from '@/lib/sponsor-engine';
export async function GET(_request: Request, {params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const status = await getBidStatus(id);
  return Response.json({status: status || 'not_found'}, {status: status ? 200 : 404, headers: {'Cache-Control': 'no-store'}});
}
