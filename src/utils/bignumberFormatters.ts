import BigNumber from 'bignumber.js/bignumber';

import { BIG_TEN } from './constants';

/**
 * @param amount 1 (`decimals` = 18)
 * @returns 1000000000000000000 (=`amount` * 10 ** `decimals`)
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18): BigNumber => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

/**
 * @param decimalAmount 1000000000000000000 (`decimals` = 18)
 * @returns 1 (=`decimalAmount` / 10 ** `decimals`)
 */
export const getBalanceAmountBN = (decimalAmount: BigNumber, decimals = 18): BigNumber => {
  return new BigNumber(decimalAmount).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * @param decimalAmount 1000000000000000000 (`decimals` = 18)
 * @returns 1 (=`decimalAmount` / 10 ** `decimals`)
 */
export const getBalanceAmount = (decimalAmount: BigNumber, decimals = 18): number => {
  return getBalanceAmountBN(decimalAmount, decimals).toNumber();
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
