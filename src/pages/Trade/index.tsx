import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { TradeNavbar, Exchange, ExchangeSettings } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = React.memo(() => {
  return (
    <main className="trade box-f-c">
      <div className="trade__content">
        <TradeNavbar />
        <Switch>
          <Route exact path="/trade/swap" component={Exchange} />
          <Route exact path="/trade/swap/settings" component={ExchangeSettings} />
        </Switch>
      </div>
    </main>
  );
});

export default Trade;
