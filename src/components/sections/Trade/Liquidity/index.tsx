import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { YourLiquidity, ExchangeSettings, RecentTxs, ImportPool, AddLiquidity } from '..';
import { IActiveSlippage } from '../ExchangeSettings';
import TradeWrapper from '../../../../HOC/TradeWrapper';

export interface ISettings {
  slippage: IActiveSlippage;
  txDeadline: number;
}

const Liquidity: React.FC = () => {
  const [settings, setSettings] = React.useState<ISettings>({
    slippage: {
      type: 'btn',
      value: 0.1,
    },
    txDeadline: NaN,
  });

  const handleSaveSettings = (settingsObj: ISettings): void => {
    setSettings(settingsObj);
  };
  const AddLiquidityComp = TradeWrapper(AddLiquidity);

  return (
    <Switch>
      <Route exact path="/trade/liquidity" render={() => <YourLiquidity />} />
      <Route exact path="/trade/liquidity/find" render={() => <ImportPool />} />
      <Route exact path="/trade/liquidity/add" render={() => <AddLiquidityComp />} />
      <Route
        exact
        path="/trade/liquidity/settings"
        render={() => <ExchangeSettings savedSettings={settings} handleSave={handleSaveSettings} />}
      />
      <Route exact path="/trade/liquidity/history" component={RecentTxs} />
    </Switch>
  );
};

export default Liquidity;
