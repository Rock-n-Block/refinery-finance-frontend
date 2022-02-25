import { fetchPairsPrices } from '@/services/api/swaps';

export const getPairPrice = async (tokenStart: string, tokenEnd: string) => {
  const { pairs } = await fetchPairsPrices();

  const currentPair = pairs.find(
    (pair: any) =>
      (pair.token0.id.toLowerCase() === tokenStart.toLowerCase() &&
        pair.token1.id.toLowerCase() === tokenEnd.toLowerCase()) ||
      (pair.token1.id.toLowerCase() === tokenStart.toLowerCase() &&
        pair.token0.id.toLowerCase() === tokenEnd.toLowerCase()),
  );
  return [currentPair.token0Price, currentPair.token1Price];
};
