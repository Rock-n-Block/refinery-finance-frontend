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
  // << NOT PRESENT IN POOLS
  {
    pid: 2,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      42: '0x112Dc48d876F4179627F0A29a016E6F130b07E7E',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  // NOT PRESENT IN POOLS >>
];
