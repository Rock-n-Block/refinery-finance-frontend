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
  {
    id: 2,
    stakingToken: tokens.rp1,
    earningToken: tokens.avoog,
    contractAddress: {
      42: '0x0a43e268e77cc967b192cc4126a022b0a780b9b0',
    },
    tokenPerBlock: '0.000000001',
  }
];
