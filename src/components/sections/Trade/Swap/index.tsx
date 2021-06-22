import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Exchange, ExchangeSettings, RecentTxs } from '..';
import { ITokens } from '../../../../types';
import { IActiveSlippage } from '../ExchangeSettings';

import BnbImg from '@/assets/img/currency/bnb.svg';

export interface ISettings {
  slippage: IActiveSlippage;
  txDeadline: number;
}

const Swap: React.FC = () => {
  const [settings, setSettings] = React.useState<ISettings>({
    slippage: {
      type: 'btn',
      value: 0.1,
    },
    txDeadline: NaN,
  });

  const [tokensData, setTokensData] = React.useState<ITokens>({
    from: {
      token: {
        img: BnbImg,
        name: 'Binance',
        symbol: 'BNB',
      },
      amount: NaN,
    },
    to: {
      token: {
        img: BnbImg,
        name: 'Ethereum',
        symbol: 'ETH',
      },
      amount: NaN,
    },
  });

  const handleSaveSettings = (settingsObj: ISettings): void => {
    setSettings(settingsObj);
  };

  const handleSetTokens = (tokens: ITokens) => {
    setTokensData(tokens);
  };

  return (
    <Switch>
      <Route
        exact
        path="/trade/swap"
        render={() => (
          <Exchange handleChangeTokens={handleSetTokens} initialTokenData={tokensData} />
        )}
      />
      <Route
        exact
        path="/trade/swap/settings"
        render={() => <ExchangeSettings savedSettings={settings} handleSave={handleSaveSettings} />}
      />
      <Route exact path="/trade/swap/history" component={RecentTxs} />
    </Switch>
  );
};

export default Swap;
