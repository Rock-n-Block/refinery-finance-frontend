import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';

export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);
export const BIG_TEN = new BigNumber(10);

export const MAX_UINT_256 = Web3.utils.hexToNumberString(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
