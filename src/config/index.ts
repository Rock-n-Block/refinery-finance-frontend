import BigNumber from 'bignumber.js/bignumber';

export { contracts } from './contracts';
export { tokens } from './tokens';
export { pools } from './pools';
export { farms } from './farms';

export enum GAS_PRICE_ETHERS {
  default = '5',
  fast = '6',
  instant = '7',
  testnet = '10',
}

export const BSC_BLOCK_TIME = 3;
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365); // 10512000
