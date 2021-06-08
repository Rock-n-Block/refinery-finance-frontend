import React from 'react';

import { TradeNavbar, Swap } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = React.memo(() => {
  return (
    <main className="trade box-f-c">
      <div className="trade__content">
        <TradeNavbar />
        <Swap />
      </div>
    </main>
  );
});

export default Trade;
