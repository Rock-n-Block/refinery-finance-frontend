import { Pool } from '@/types';
import { getApy } from '@/utils/compoundApy';
import moment from 'moment';

export const durationFormatter = (timeLeft: number, separator = ' : ') => {
  const duration = moment.duration(timeLeft);
  const items = [`${duration.days()}d`, `${duration.hours()}h`, `${duration.minutes()}m`];
  return items.join(separator);
};

export const secondsToHoursFormatter = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined) return '##h';
  const ms = seconds * 1000;
  const hours = moment.duration(ms).asHours();
  return `${hours}h`;
};

const AUTO_VAULT_COMPOUND_FREQUENCY = 5000;
const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0;

export const getAprData = (pool: Pool, performanceFee: number) => {
  const { isAutoVault, apr } = pool;

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = isAutoVault
    ? AUTO_VAULT_COMPOUND_FREQUENCY
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY;

  if (isAutoVault) {
    const autoApr =
      getApy({
        apr: Number(apr),
        compoundFrequency: AUTO_VAULT_COMPOUND_FREQUENCY,
        days: 365,
        performanceFee,
      }) * 100;
    return { apr: autoApr, autoCompoundFrequency };
  }
  return { apr, autoCompoundFrequency };
};

export const getPoolBlockInfo = (pool: Pool, currentBlock: number) => {
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
