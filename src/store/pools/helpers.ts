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

export const convertRefineryToShares = (
  refinery: BigNumber,
  refineryPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceAmount(refineryPerFullShare, decimals);
  const amountInShares = new BigNumber(refinery.dividedBy(sharePriceNumber));
  const sharesAsNumberBalance = getBalanceAmount(amountInShares, decimals);
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals);
  const sharesAsDisplayBalance = getFullDisplayBalance({
    balance: amountInShares,
    decimals,
    displayDecimals: decimalsToRound,
  });
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance };
};

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData?.stakingTokenBalance
      ? new BigNumber(userData.stakingTokenBalance)
      : BIG_ZERO,
    stakedBalance: userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO,
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

export const getRefineryVaultEarnings = (
  accountAddress: string,
  refineryAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
) => {
  const hasAutoEarnings =
    accountAddress &&
    refineryAtLastUserAction &&
    refineryAtLastUserAction.gt(0) &&
    userShares &&
    userShares.gt(0);
  const { refineryAsBigNumber } = convertSharesToRefinery(userShares, pricePerFullShare);
  const autoRefineryProfit = refineryAsBigNumber.minus(refineryAtLastUserAction);
  const autoRefineryToDisplay = autoRefineryProfit.gte(0)
    ? getBalanceAmount(autoRefineryProfit, 18)
    : 0;

  // const autoUsdProfit = autoCakeProfit.times(earningTokenPrice);
  // const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoRefineryToDisplay, autoRefineryProfit };
};
