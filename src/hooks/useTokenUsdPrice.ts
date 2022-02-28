import { useCallback, useMemo } from 'react';

import { TTokenKey } from '@/config/tokens';
import { getTokenData } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { getPairPrice } from '@/utils/getPairPrice';
import { clog } from '@/utils/logger';

type IUseRefineryUsdPriceArgs =
  | {
      tokenName1?: TTokenKey;
      tokenName2?: TTokenKey;
      tokenAddress1?: string;
      tokenAddress2?: string;
    }
  | undefined;

export const useRefineryUsdPrice = ({
  tokenName1,
  tokenName2,
  tokenAddress1,
  tokenAddress2,
}: IUseRefineryUsdPriceArgs = {}) => {
  const { tokenPrices } = useMst();

  const { address: tokenAddressByName1 } = useMemo(() => getTokenData(tokenName1 || 'rp1'), [
    tokenName1,
  ]);
  const { address: tokenAddressByName2 } = useMemo(() => getTokenData(tokenName2 || 'usdt'), [
    tokenName2,
  ]);
  const path: [string, string] = useMemo(() => {
    if (tokenAddress1 && tokenAddress2) {
      return [tokenAddress1, tokenAddress2];
    }
    return [tokenAddressByName1, tokenAddressByName2];
  }, [tokenAddress1, tokenAddress2, tokenAddressByName1, tokenAddressByName2]);
  const fetchUsdPrice = useCallback(async () => {
    try {
      const [amountFrom, amountTo] = await getPairPrice(...path);
      tokenPrices.setTokenPrice(...path, amountTo);
      tokenPrices.setTokenPrice(...(path.reverse() as [string, string]), amountFrom);
      return amountTo;
    } catch (err) {
      clog(err);
      return undefined;
    }
  }, [path, tokenPrices]);

  const tokenUsdPrice = tokenPrices.getTokenPrice(
    tokenAddress1 || tokenAddressByName1,
    tokenAddress2 || tokenAddressByName2,
  );

  return { tokenUsdPrice, fetchUsdPrice };
};
