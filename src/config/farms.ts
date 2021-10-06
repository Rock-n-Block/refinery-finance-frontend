import { FarmConfig } from '@/types';
import { tokens } from './tokens';

import { contracts } from './contracts';

export const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'RP1',
    lpAddresses: {
      42: contracts.RP1.ADDRESS,
    },
    token: tokens.fuel,
    quoteToken: tokens.wbnb, // ??
  },
  {
    pid: 1,
    lpSymbol: 'TMPT-BBSHK LP',
    lpAddresses: {
      42: '0xE272657CD75052eCeF43D24F3Bb93faa67733b2c',
    },
    token: tokens.tmpt,
    quoteToken: tokens.bbshk,
  },
  {
    pid: 2,
    lpSymbol: 'UGBG-AVOOG LP',
    lpAddresses: {
      42: '0xc11425B023aF7AD46d16e880BFB56de9c6f16DA5',
    },
    token: tokens.ugbg,
    quoteToken: tokens.avoog,
    categoryType: 'core',
  }
];
