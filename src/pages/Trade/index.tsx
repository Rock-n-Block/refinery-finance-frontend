import React from 'react';

import { TradeNavbar, Swap, Liquidity } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = React.memo(() => {
  return (
    <main className="trade box-f box-f-jc-c">
      <div className="trade__content">
        <TradeNavbar />
        <Swap />
        <Liquidity />
      </div>
    </main>
  );
});

export default Trade;
