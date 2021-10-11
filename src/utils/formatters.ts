import BigNumber from 'bignumber.js/bignumber';

import { BIG_TEN } from './constants';

export const getDecimalAmount = (amount: BigNumber, decimals = 18): BigNumber => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18): number => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals)).toNumber();
};

export const getBalanceAmountBN = (amount: BigNumber, decimals = 18): BigNumber => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

export const getFullDisplayBalance = (params: {
  balance: BigNumber;
  decimals?: number;
  displayDecimals?: number;
}): string | number => {
  const { balance, decimals = 18, displayDecimals } = params;
  const ret = getBalanceAmount(balance, decimals);
  return typeof displayDecimals === 'number' ? ret.toFixed(displayDecimals) : ret;
};

export const numberWithCommas = (number: number): string => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const feeFormatter = (
  fee: number | null | undefined,
  maxValue = 100,
  noDataDummy = '###',
): string | number => {
  return fee === null || fee === undefined ? noDataDummy : fee / maxValue;
};

export const loadingDataFormatter = (
  value?: number | string | null | undefined | BigNumber,
  options: {
    noDataDummy?: string;
    decimals?: number;
    displayDecimals?: number;
  } = {},
): string | number => {
  const { noDataDummy = '###', ...otherOptions } = options;
  if (value === null || value === undefined) return noDataDummy;
  return getFullDisplayBalance({
    balance: BigNumber.isBigNumber(value) ? value : new BigNumber(value),
    ...otherOptions,
    // decimals: options?.decimals,
    // displayDecimals: options?.
  });
  // return getBalanceAmount(BigNumber.isBigNumber(value) ? value : new BigNumber(value));
};
