import React from 'react';

import { TradeNavbar } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = React.memo(() => {
  return (
    <main className="trade box-f-c">
      <div className="trade__content">
        <TradeNavbar />
      </div>
    </main>
  );
});

export default Trade;
