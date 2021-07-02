import React from 'react';

import { PoolsPreview, PoolCard } from '../../components/sections/Pools';
import { ItemsController } from '../../components/organisms';
import { IPoolCard } from '../../components/sections/Pools/PoolCard';

import './Pools.scss';

const Pools: React.FC = () => {
  const pools: IPoolCard[] = [
    {
      tokenEarn: {
        name: 'WBNB Token',
        symbol: 'WBNB',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        chainId: 56,
        decimals: 18,
        logoURI:
          'https://tokens.pancakeswap.finance/images/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
      },
      tokenStake: {
        name: 'PancakeSwap Token',
        symbol: 'CAKE',
        address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        chainId: 56,
        decimals: 18,
        logoURI:
          'https://tokens.pancakeswap.finance/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
      },
      type: 'earn',
      apr: {
        value: 150,
        items: [
          {
            timeframe: '1D',
            roi: 0.19,
            rf: 0.12,
          },
          {
            timeframe: '1D',
            roi: 0.19,
            rf: 0.12,
          },
        ],
      },
    },
    {
      tokenStake: {
        name: 'Cake',
        symbol: 'CAKE',
        address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        chainId: 56,
        decimals: 18,
        logoURI:
          'https://tokens.pancakeswap.finance/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
      },
      type: 'auto',
      apr: {
        value: 150,
        items: [
          {
            timeframe: '1D',
            roi: 0.19,
            rf: 0.12,
          },
          {
            timeframe: '1D',
            roi: 0.19,
            rf: 0.12,
          },
        ],
      },
    },
  ];
  return (
    <main className="pools">
      <div className="row">
        <PoolsPreview />
        <ItemsController />
        <div className="pools__content box-f">
          {pools.map((pool) => (
            <PoolCard
              {...pool}
              key={`${pool.tokenEarn?.address}${pool.tokenStake.address}`}
              type={pool.type}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Pools;
