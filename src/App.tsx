import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Menu } from './components/sections';
import { Button } from './components/atoms';
import { MetamaskErrModal } from './components/molecules';
import { TradePage } from './pages';
import { useWalletConnectorContext } from './services/MetamaskConnect';
import { useMst } from './store';

import './styles/index.scss';

const App: React.FC = observer(() => {
  const connector = useWalletConnectorContext();
  const { user } = useMst();

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
          ]}
          component={TradePage}
        />
      </Switch>
      <MetamaskErrModal />
    </div>
  );
});

export default App;
