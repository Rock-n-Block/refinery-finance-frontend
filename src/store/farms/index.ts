import BigNumber from 'bignumber.js/bignumber';

import { Farm } from '@/types';
import { getAddress } from '@/services/web3/contractHelpers';
import rootStore from '@/store';

export const getTokenPricesFromFarms = () => {
  const farms = rootStore.farms.data.slice() as Farm[];
  return farms.reduce((prices: Record<string, number>, farm) => {
    const quoteTokenAddress = getAddress(farm.quoteToken.address).toLocaleLowerCase();
    const tokenAddress = getAddress(farm.token.address).toLocaleLowerCase();
    if (farm.quoteToken.busdPrice !== undefined) {
      if (!prices[quoteTokenAddress]) {
        prices[quoteTokenAddress] = new BigNumber(farm.quoteToken.busdPrice).toNumber();
      }
    }

    if (farm.token.busdPrice !== undefined) {
      if (!prices[tokenAddress]) {
        prices[tokenAddress] = new BigNumber(farm.token.busdPrice).toNumber();
      }
    }
    return prices;
  }, {});
};
