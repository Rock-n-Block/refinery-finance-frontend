import { useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';

import { Pool } from '@/types';
import { toBigNumber } from '@/utils';

export const mockData = {
  currencyToConvert: 'USD',
};

export const durationFormatter = (timeLeft: number, separator = ' : '): string => {
  const duration = moment.duration(timeLeft);
  const items = [`${duration.days()}d`, `${duration.hours()}h`, `${duration.minutes()}m`];
  return items.join(separator);
};

export const secondsToHoursFormatter = (seconds: number | null | undefined): string => {
  if (seconds === null || seconds === undefined) return '##h';
  const ms = seconds * 1000;
  const hours = moment.duration(ms).asHours();
  return `${hours}h`;
};

export const getPoolBlockInfo = (
  pool: Pool,
  currentBlock: number,
): {
  shouldShowBlockCountdown: boolean;
  blocksUntilStart: number;
  blocksRemaining: number;
  hasPoolStarted: boolean;
  blocksToDisplay: number;
} => {
  const { startBlock, endBlock, isFinished } = pool;
  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock);
  const blocksUntilStart = Math.max((startBlock as number) - currentBlock, 0);
  const blocksRemaining = Math.max((endBlock as number) - currentBlock, 0);
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0;
  const blocksToDisplay = hasPoolStarted ? blocksRemaining : blocksUntilStart;
  return {
    shouldShowBlockCountdown,
    blocksUntilStart,
    blocksRemaining,
    hasPoolStarted,
    blocksToDisplay,
  };
};

export const useNonAutoVaultEarnings = (
  pool: Pool,
): {
  nonAutoVaultEarnings: BigNumber;
  nonAutoVaultEarningsAsString: string;
} => {
  const { userData } = pool;

  const nonAutoVaultEarnings = useMemo(() => toBigNumber(userData?.pendingReward), [
    userData?.pendingReward,
  ]);
  const nonAutoVaultEarningsAsString = useMemo(() => nonAutoVaultEarnings.toString(), [
    nonAutoVaultEarnings,
  ]);

  return { nonAutoVaultEarnings, nonAutoVaultEarningsAsString };
};
