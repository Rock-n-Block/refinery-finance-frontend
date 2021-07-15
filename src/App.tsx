import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Header } from './components/sections';
import { MetamaskErrModal, RoiModal } from './components/molecules';
import {
  TradePage,
  LotteryPage,
  FarmsPage,
  PoolsPage,
  CollectiblesPage,
  TeamsPage,
  TeamPage,
} from './pages';
import { useMst } from './store';

import './styles/index.scss';

const App: React.FC = observer(() => {
  const { tokens } = useMst();

  React.useEffect(() => {
    tokens.getTokens('default');
    tokens.getTokens('top');
    tokens.getTokens('extended');
    tokens.getTokens('imported');
  }, [tokens]);

  return (
    <div className="ref-finance">
      <Header />
      <Switch>
        <Route
          exact
          path={[
            '/trade',
            '/trade/swap',
            '/trade/liquidity',
            '/trade/bridge',
            '/trade/swap/settings',
            '/trade/swap/history',
            '/trade/liquidity/settings',
            '/trade/liquidity/history',
            '/trade/liquidity/find',
            '/trade/liquidity/add',
            '/trade/liquidity/remove',
            '/trade/liquidity/receive',
          ]}
          component={TradePage}
        />
        <Route exact path={['/lottery/:id', '/lottery']} component={LotteryPage} />
        <Route exact path="/farms" component={FarmsPage} />
        <Route exact path="/pools" component={PoolsPage} />
        <Route exact path="/collectibles" component={CollectiblesPage} />
        <Route exact path="/teams" component={TeamsPage} />
        <Route exact path="/team/:id" component={TeamPage} />
      </Switch>
      <MetamaskErrModal />
      <RoiModal />
    </div>
  );
});

export default App;
