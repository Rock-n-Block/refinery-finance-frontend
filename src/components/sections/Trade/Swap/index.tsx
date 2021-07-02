import React from 'react';
import { Switch, Route } from 'react-router-dom';
import moment from 'moment';

import { Exchange, ExchangeSettings, RecentTxs } from '..';
import { ISettings } from '../../../../types';
import TradeWrapper from '../../../../HOC/TradeWrapper';

const Swap: React.FC = () => {
  const [settings, setSettings] = React.useState<ISettings>({
    slippage: {
      type: 'btn',
      value: 0.1,
    },
    txDeadline: 20,
    txDeadlineUtc: moment.utc().add(20, 'm').valueOf(),
  });

  const handleSaveSettings = (settingsObj: ISettings): void => {
    setSettings(settingsObj);
  };

  const ExchangeComp = TradeWrapper(Exchange, settings);

  return (
    <Switch>
      <Route exact path="/trade/swap" render={() => <ExchangeComp />} />
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
