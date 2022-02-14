import React from 'react';

import { Liquidity, Swap, TradeNavbar } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = React.memo(() => {
  return (
    <main className="trade">
      <div className="trade__content">
        <TradeNavbar />
        <Swap />
        <Liquidity />
      </div>
    </main>
  );
});

export default Trade;
