import React, { useCallback } from 'react';

import { useMst } from '@/store';
import { getStakingBalance } from '@/store/pools/helpers';
import { useStakedValue } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { getApy } from '@/utils/compoundApy';
import { feeFormatter } from '@/utils/formatters';

import { useRefineryUsdPrice } from '../useTokenUsdPrice';

const AUTO_VAULT_COMPOUND_FREQUENCY = 5000;
const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0;

const DAYS_IN_YEAR = 365;

/**
 *
 * @param pool
 * @param performanceFee as decimal (200 / 100 = 2 or 45 / 100 = 0.45)
 * @returns
 */
export const getAprData = (
  pool: Pool,
  performanceFee = 0,
): {
  apr: number;
  autoCompoundFrequency: number;
} => {
  const { isAutoVault, apr = 0 } = pool;

  // Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = isAutoVault
    ? AUTO_VAULT_COMPOUND_FREQUENCY
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY;

  if (isAutoVault) {
    const autoApr =
      getApy({
        apr: Number(apr),
        compoundFrequency: AUTO_VAULT_COMPOUND_FREQUENCY,
        days: DAYS_IN_YEAR,
        performanceFee,
      }) * 100;
    return { apr: autoApr, autoCompoundFrequency };
  }
  return { apr, autoCompoundFrequency };
};

export const useAprModal = (farmMode: IPoolFarmingMode, pool: Pool) => {
  const {
    modals,
    pools: {
      fees: { performanceFee: globalPerformanceFee },
    },
  } = useMst();
  const {
    earningToken,
    stakingToken,
    // apr, earningTokenPrice, stakingTokenPrice // TODO: use it
  } = pool;
  const performanceFee =
    farmMode === PoolFarmingMode.auto ? Number(feeFormatter(globalPerformanceFee)) : 0;
  const { apr: earningsPercentageToDisplay, autoCompoundFrequency } = getAprData(
    pool,
    performanceFee,
  );

  const { stakedValue } = useStakedValue(farmMode, pool);
  const stakingTokenBalance = stakedValue.plus(getStakingBalance(pool));

  const { tokenUsdPrice } = useRefineryUsdPrice();

  // console.log({
  //   apr,
  //   earningTokenPrice,
  //   stakingTokenPrice,
  // });

  const handleOpenAprModal = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent): void => {
      e.stopPropagation();
      modals.roi.open({
        isFarmPage: false,
        autoCompoundFrequency,
        performanceFee,
        apr: 13, // TODO: somehow fetch apr (github actions) apr || 0,   <----
        earningTokenSymbol: earningToken.symbol,
        earningTokenPrice: '10', //                                      <----
        stakingTokenSymbol: stakingToken.symbol,
        stakingTokenPrice: tokenUsdPrice, //                             <---- 12.0529 (RP1 -> USDT)
        stakingTokenBalance: stakingTokenBalance.toFixed(),
      });
    },
    [
      autoCompoundFrequency,
      earningToken.symbol,
      modals.roi,
      performanceFee,
      stakingToken.symbol,
      stakingTokenBalance,
      tokenUsdPrice,
    ],
  );

  return {
    earningsPercentageToDisplay,
    handleOpenAprModal,
  };
};
