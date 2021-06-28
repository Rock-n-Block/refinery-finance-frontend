import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Menu } from './components/sections';
import { Button } from './components/atoms';
import { MetamaskErrModal, RoiModal } from './components/molecules';
import { TradePage, LotteryPage, FarmsPage, PoolsPage } from './pages';
import { useWalletConnectorContext } from './services/MetamaskConnect';
import { useMst } from './store';

import './styles/index.scss';

const App: React.FC = observer(() => {
  const connector = useWalletConnectorContext();
  const { user, tokens } = useMst();

  React.useEffect(() => {
    tokens.getTokens('default');
    tokens.getTokens('top');
    tokens.getTokens('extended');
    tokens.getTokens('imported');
  }, [tokens]);

  return (
    <div className="ref-finance">
      <Menu />
      {!user.address ? (
        <Button className="ref-finance__connect" onClick={connector.connect}>
          <span className="text-bold text-white">Connect Wallet</span>
        </Button>
      ) : (
        ''
      )}
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
          ]}
          component={TradePage}
        />
        <Route exact path={['/lottery/:id', '/lottery']} component={LotteryPage} />
        <Route exact path="/farms" component={FarmsPage} />
        <Route exact path="/pools" component={PoolsPage} />
      </Switch>
      <MetamaskErrModal />
      <RoiModal />
    </div>
  );
});

export default App;
