import BigNumber from 'bignumber.js/bignumber';

const BIG_TEN = new BigNumber(10);

export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals)).toNumber();
};

export const getFullDisplayBalance = (params: {
  balance: BigNumber;
  decimals?: number;
  displayDecimals?: number;
}) => {
  const { balance, decimals = 18, displayDecimals } = params;
  const ret = getBalanceAmount(balance, decimals);
  return typeof displayDecimals === 'number' ? ret.toFixed(displayDecimals) : ret;
};
