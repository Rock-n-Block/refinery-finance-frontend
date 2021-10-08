import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import useRefresh from '@/hooks/useRefresh';
import { IPoolFarmingMode, Pool } from '@/types';
import { toBigNumber } from '@/utils';

import { useMst } from '..';

import { getStakedValue, transformPool } from './helpers';

export const usePools = (): { pools: Pool[] } => {
  const { fastRefresh } = useRefresh();
  const { pools: poolStore, user } = useMst();

  useEffect(() => {
    if (user.address) {
      poolStore.fetchPoolsUserDataAsync(user.address);
    }
  }, [user.address, poolStore, fastRefresh]);

  return { pools: poolStore.data.slice().map(transformPool as any) };
};

export const useSelectVaultData = () => {
  const {
    pools: {
      estimatedRefineryBountyReward: estimatedRefineryBountyRewardRaw,
      totalRefineryInVault: totalRefineryInVaultRaw,
      pricePerFullShare: pricePerFullShareRaw,
      totalShares: totalSharesRaw,
      fees,
      userData: {
        isLoading,
        userShares: userSharesAsString,
        refineryAtLastUserAction: refineryAtLastUserActionAsString,
        lastDepositedTime,
        lastUserActionTime,
      },
    },
  } = useMst();

  const estimatedRefineryBountyReward = useMemo(() => {
    return toBigNumber(estimatedRefineryBountyRewardRaw, true);
  }, [estimatedRefineryBountyRewardRaw]);

  const totalRefineryInVault = useMemo(() => {
    return toBigNumber(totalRefineryInVaultRaw, true);
  }, [totalRefineryInVaultRaw]);

  const pricePerFullShare = useMemo(() => {
    return toBigNumber(pricePerFullShareRaw, true);
  }, [pricePerFullShareRaw]);

  const totalShares = useMemo(() => {
    return toBigNumber(totalSharesRaw, true);
  }, [totalSharesRaw]);

  const userShares = useMemo(() => {
    return toBigNumber(userSharesAsString, true);
  }, [userSharesAsString]);

  const refineryAtLastUserAction = useMemo(() => {
    return toBigNumber(refineryAtLastUserActionAsString, true);
  }, [refineryAtLastUserActionAsString]);

  return {
    estimatedRefineryBountyReward,
    totalRefineryInVault,
    pricePerFullShare,
    totalShares,
    fees,
    userData: {
      isLoading,
      userShares,
      refineryAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  };
};

export const useStakedValue = (farmMode: IPoolFarmingMode, pool: Pool): BigNumber => {
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();

  return getStakedValue(farmMode, pool, userShares, pricePerFullShare);
};
