import BidForm from '@/components/BidForm';
export default async function BidPage({searchParams}: {searchParams: Promise<{rank?: string}>}) {
  const {rank} = await searchParams;
  const value = Number(rank);
  return <BidForm initialRank={Number.isInteger(value) && value >= 1 && value <= 8 ? value : 1} />;
}
