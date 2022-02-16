/* eslint-disable no-restricted-syntax */
import { getAllPairs } from '@/services/api/swaps';
import rootStore from '@/store';

export const pathFinder = async (startAddress: string, endAddress: string): Promise<string[][]> => {
  const tokens = [...rootStore.tokens.default, ...rootStore.tokens.imported]; // TODO change for current group of tokens
  // const tokens = Object.values(rootStore.tokens).flat(); // TODO change for current group of tokens
  const { pairs } = await getAllPairs();

  const tokensAddresses = tokens.reduce((addressesArr: string[], token) => {
    if (token.address !== startAddress) {
      return [...addressesArr, token.address.toLowerCase()];
    }
    return addressesArr;
  }, []);

  let simplyPaths = new Set([[startAddress.toLowerCase()]]);
  const hardPath: string[][] = [];

  while (simplyPaths.size > 0) {
    const nextPaths: string[][] = [];

    for (const path of Array.from(simplyPaths)) {
      for (const address of tokensAddresses) {
        if (!path.includes(address)) {
          pairs.forEach((pair: any) => {
            const addressFirst = pair.token0.id.toLowerCase();
            const addressSecond = pair.token1.id.toLowerCase();

            const equalFirstToken =
              addressFirst === path[path.length - 1] && addressSecond === address;
            const equalSecondToken =
              addressFirst === address && addressSecond === path[path.length - 1];

            if (equalFirstToken || equalSecondToken) {
              if (address === endAddress.toLowerCase()) {
                hardPath.push([...path, address]);
              } else nextPaths.push([...path, address]);
            }
          });
        }
      }
    }
    simplyPaths = new Set(nextPaths);
  }
  hardPath.sort((a: string[], b: string[]) => {
    return a.length - b.length;
  });
  return hardPath;
};
