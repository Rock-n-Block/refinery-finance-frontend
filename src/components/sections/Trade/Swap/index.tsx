import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Exchange, ExchangeSettings } from '..';
import { IActiveSlippage } from '../ExchangeSettings';

const Swap: React.FC = () => {
  const [slippage, setSlippage] = React.useState<IActiveSlippage>({
    type: 'btn',
    value: 0.1,
  });
  const [txDeadline, SetTxDeadline] = React.useState<number>(NaN);
  console.log(txDeadline);

  const handleChangeSlippage = (data: IActiveSlippage): void => {
    setSlippage(data);
  };

  const handleChangeTxDeadline = (value: number | string): void => {
    SetTxDeadline(+value);
  };

  return (
    <Switch>
      <Route exact path="/trade/swap" component={Exchange} />
      <Route
        exact
        path="/trade/swap/settings"
        render={() => (
          <ExchangeSettings
            activeSlippage={slippage}
            handleChangeActiveSlippage={handleChangeSlippage}
            handleChangeTxDeadline={handleChangeTxDeadline}
          />
        )}
      />
    </Switch>
  );
};

export default Swap;
