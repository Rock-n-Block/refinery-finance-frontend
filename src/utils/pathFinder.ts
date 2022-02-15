/* eslint-disable no-restricted-syntax */
import { getAllPairs } from '@/services/api/swaps';
import rootStore from '@/store';

export const pathFinder = async (startAddress: string, endAddress: string): Promise<string[]> => {
  const tokens = Object.values(rootStore.tokens.default); // TODO change for current group of tokens
  const { pairs } = await getAllPairs();
  const tokensAddresses = tokens.reduce((addressesArr: string[], token) => {
    if (token.address !== startAddress) {
      return [...addressesArr, token.address];
    }
    return addressesArr;
  }, []);

  // const WTRX = contract.WTRX.chain[type].address;
  let simplyPaths = new Set([[startAddress]]);
  // console.log(simplyPaths.values);

  const hardPath: string[][] = [];

  while (simplyPaths.size > 0) {
    const nextPaths: string[][] = [];

    for (const path of Array.from(simplyPaths)) {
      for (const address of tokensAddresses) {
        if (!path.includes(address)) {
          pairs.forEach((pair: any) => {
            const addressFirst = pair.token0.id;
            const addressSecond = pair.token1.id;

            const equalFirstToken =
              addressFirst === path[path.length - 1] && addressSecond === address;
            const equalSecondToken =
              addressFirst === address && addressSecond === path[path.length - 1];

            if ((equalFirstToken || equalSecondToken) && address === endAddress) {
              hardPath.push([...path, address]);
            } else nextPaths.push([...path, address]);
          });
        }
      }
    }
    simplyPaths = new Set(nextPaths);
  }
  hardPath.sort((a: string[], b: string[]) => {
    return a.length - b.length;
  });
  return hardPath[0] ?? [];
};
