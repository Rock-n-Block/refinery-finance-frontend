import { PoolConfig } from '@/types';
import { tokens } from '@/config/tokens';

import { contracts } from './contracts';

export const pools: PoolConfig[] = [
  {
    id: 0,
    stakingToken: tokens.rp1,
    earningToken: tokens.rp1,
    contractAddress: {
      42: contracts.MASTER_REFINER.ADDRESS,
    },
    tokenPerBlock: '1',
  },
  {
    id: 1,
    stakingToken: tokens.rp1,
    earningToken: tokens.bbshk,
    contractAddress: {
      42: '0xbf183592ce79efe53b654e9229301b910b075dfb',
    },
    tokenPerBlock: '0.0868',
    // isFinished: true,
  },
];
