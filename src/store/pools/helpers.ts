import BigNumber from 'bignumber.js/bignumber';
import { getDecimalAmount, getBalanceAmount, getFullDisplayBalance } from '@/utils/formatBalance';
import { Pool } from '@/types';

import { BIG_ZERO } from '@/utils';

type UserData =
  | Pool['userData']
  | {
      allowance: number | string;
      stakingTokenBalance: number | string;
      stakedBalance: number | string;
      pendingReward: number | string;
    };

export const convertSharesToRefinery = (
  shares: BigNumber,
  refineryPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceAmount(refineryPerFullShare, decimals);
  const amountInRefinery = new BigNumber(shares.multipliedBy(sharePriceNumber));
  const refineryAsNumberBalance = getBalanceAmount(amountInRefinery, decimals);
  const refineryAsBigNumber = getDecimalAmount(new BigNumber(refineryAsNumberBalance), decimals);
  const refineryAsDisplayBalance = getFullDisplayBalance({
    balance: amountInRefinery,
    decimals,
    displayDecimals: decimalsToRound,
  });
  return { refineryAsNumberBalance, refineryAsBigNumber, refineryAsDisplayBalance };
};

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  };
};

export const transformPool = (pool: Pool): Pool => {
  const { totalStaked, stakingLimit, userData, ...rest } = pool;

  return {
    ...rest,
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked as BigNumber),
    stakingLimit: new BigNumber(stakingLimit as BigNumber),
  } as Pool;
};
