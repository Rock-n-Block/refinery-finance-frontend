import React from 'react';
import { Switch, Route } from 'react-router-dom';
import moment from 'moment';

import { YourLiquidity, ExchangeSettings, RecentTxs, ImportPool, AddLiquidity } from '..';
import TradeWrapper from '../../../../HOC/TradeWrapper';
import { ISettings } from '../../../../types';

const Liquidity: React.FC = () => {
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
  const AddLiquidityComp = TradeWrapper(AddLiquidity, 'quote', settings);

  return (
    <Switch>
      <Route exact path="/trade/liquidity" render={() => <YourLiquidity />} />
      <Route exact path="/trade/liquidity/find" render={() => <ImportPool />} />
      <Route exact path="/trade/liquidity/add" render={() => <AddLiquidityComp />} />
      <Route
        exact
        path="/trade/liquidity/settings"
        render={() => (
          <ExchangeSettings
            savedSettings={settings}
            handleSave={handleSaveSettings}
            isSlippage={false}
          />
        )}
      />
      <Route exact path="/trade/liquidity/history" component={RecentTxs} />
    </Switch>
  );
};

export default Liquidity;
