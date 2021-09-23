import { PoolConfig } from '@/types';
import { tokens } from '@/config/tokens';

export const pools: PoolConfig[] = [
  {
    id: 0,
    stakingToken: tokens.rp1,
    earningToken: tokens.rp1,
    contractAddress: {
      42: '0x318D824BB3DD82c4b062adbC6Fe561cE4d95a3B4',
    },
    tokenPerBlock: '1',
  },
  {
    id: 1,
    stakingToken: tokens.rp1,
    earningToken: tokens.tst,
    contractAddress: {
      42: '0xd878d796a49ef940351a1569ae4af80142bc5959',
    },
    tokenPerBlock: '10',
    // isFinished: true,
  },
];
