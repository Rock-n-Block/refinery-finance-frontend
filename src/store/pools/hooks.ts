import { useEffect, useMemo } from 'react';
import { useMst } from '..';

import { getStakedValue, transformPool } from './helpers';
import { IPoolFarmingMode, Pool } from '@/types';
import useRefresh from '@/hooks/useRefresh';
import { convertToBigNumber } from '@/utils';

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
    return convertToBigNumber(estimatedRefineryBountyRewardRaw);
  }, [estimatedRefineryBountyRewardRaw]);

  const totalRefineryInVault = useMemo(() => {
    return convertToBigNumber(totalRefineryInVaultRaw);
  }, [totalRefineryInVaultRaw]);

  const pricePerFullShare = useMemo(() => {
    return convertToBigNumber(pricePerFullShareRaw);
  }, [pricePerFullShareRaw]);

  const totalShares = useMemo(() => {
    return convertToBigNumber(totalSharesRaw);
  }, [totalSharesRaw]);

  const userShares = useMemo(() => {
    return convertToBigNumber(userSharesAsString);
  }, [userSharesAsString]);

  const refineryAtLastUserAction = useMemo(() => {
    return convertToBigNumber(refineryAtLastUserActionAsString);
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

export const useStakedValue = (farmMode: IPoolFarmingMode, pool: Pool) => {
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();

  return getStakedValue(farmMode, pool, userShares, pricePerFullShare);
};