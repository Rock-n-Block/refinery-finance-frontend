import { useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { useSelectVaultData } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode, Precisions } from '@/types';
import { loadingDataFormatter } from '@/utils/formatters';

export const useTotalStaked = (
  pool: Pool,
  farmMode: IPoolFarmingMode,
): {
  totalStakedBalance: BigNumber | null | undefined;
  totalStakedBalanceToDisplay: string | number;
} => {
  const { stakingToken, totalStaked } = pool;
  const { totalRefineryInVault, availableRefineryAmountToCompound } = useSelectVaultData();

  const totalStakedBalance = useMemo(() => {
    switch (farmMode) {
      case PoolFarmingMode.auto:
        return totalRefineryInVault;
      case PoolFarmingMode.manual: {
        if (!totalStaked || !totalRefineryInVault) return null;
        // workaround for some cases
        // -> if Auto Pool has stakedValue/shares and compound hasn't been taken then correct value of ManualPool (it will be negative by totalStaked RP1 in Auto Pool + ManualPool)
        // Given: AP totalStaked = 1000; MP totalStaked = 0; available: 1000
        // AP totalStaked: 1000; MP totalStaked: (MP) - (AP) + (available) = 0
        const manualPoolTotalStakedBalance = new BigNumber(totalStaked)
          .minus(totalRefineryInVault)
          .plus(availableRefineryAmountToCompound);
        if (manualPoolTotalStakedBalance.lt(0)) return null;
        return manualPoolTotalStakedBalance;
      }
      case PoolFarmingMode.earn:
      default:
        return totalStaked;
    }
  }, [farmMode, totalRefineryInVault, availableRefineryAmountToCompound, totalStaked]);

  const totalStakedBalanceToDisplay = useMemo(
    () =>
      loadingDataFormatter(totalStakedBalance, {
        decimals: stakingToken.decimals,
        displayDecimals: Precisions.shortToken,
      }),
    [totalStakedBalance, stakingToken.decimals],
  );

  return {
    totalStakedBalance,
    totalStakedBalanceToDisplay,
  };
};
