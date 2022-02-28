import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { tokens } from '@/config';
import { getAddress } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { Farm } from '@/types';
import { getBalanceAmount } from '@/utils';
import { BIG_ZERO } from '@/utils/constants';

import { useRefineryUsdPrice } from '../useTokenUsdPrice';
// import { clog } from '@/utils/logger';

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const { farms } = useMst();
  const [farm] = farms.data.filter((f) => f.lpSymbol === lpSymbol);
  return farm as Farm;
};

export const useFarmFromPid = (pid: number): Farm => {
  const { farms } = useMst();
  const [farm] = farms.data.filter((f) => f.pid === pid);
  return farm as Farm;
};

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid);
  const { tokenUsdPrice, fetchUsdPrice } = useRefineryUsdPrice({
    tokenAddress1: getAddress(farm.token.address),
    tokenAddress2: getAddress(tokens.usdt.address),
  });
  const price = useMemo(() => {
    // if (farm.token?.busdPrice) {
    //   return new BigNumber(farm.token.busdPrice);
    // }
    return new BigNumber(tokenUsdPrice);
  }, [tokenUsdPrice]);

  useEffect(() => {
    fetchUsdPrice();
  }, [fetchUsdPrice]);
  return price;
};

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol);
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid);
  let lpTokenPrice = BIG_ZERO;

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal || BIG_ZERO);
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply));
    // console.log(
    //   'overallValueOfAllTokensInFarm',
    //   overallValueOfAllTokensInFarm.toFixed(),
    //   totalLpTokens.toFixed(),
    // );
    lpTokenPrice = overallValueOfAllTokensInFarm.dividedBy(totalLpTokens);

    // clog('TEST1', farmTokenPriceInUsd, farm.tokenAmountTotal, overallValueOfAllTokensInFarm);
  }

  return lpTokenPrice;
};
