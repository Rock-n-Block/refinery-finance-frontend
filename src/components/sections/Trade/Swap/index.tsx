import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Exchange, ExchangeSettings, RecentTxs } from '..';
import { ITokens, ISettings } from '../../../../types';

import BnbImg from '@/assets/img/currency/bnb.svg';

const Swap: React.FC = () => {
  const [settings, setSettings] = React.useState<ISettings>({
    slippage: {
      type: 'btn',
      value: 0.1,
    },
    txDeadline: NaN,
    txDeadlineUtc: NaN,
  });

  const [tokensData, setTokensData] = React.useState<ITokens>({
    from: {
      token: {
        logoURI: BnbImg,
        name: 'Binance',
        symbol: 'BNB',
        address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        decimals: 8,
      },
      amount: NaN,
    },
    to: {
      token: {
        logoURI: BnbImg,
        name: 'Ethereum',
        symbol: 'ETH',
        address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        decimals: 8,
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
