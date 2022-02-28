import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { MetamaskErrModal, RoiModal } from './components/molecules';
import { Header } from './components/sections';
import { useRefineryUsdPrice } from './hooks/useTokenUsdPrice';
import {
  // CollectiblesPage,
  // CreateProfilePage,
  DaoListPage,
  DaoPage,
  DaoProposalPage,
  FarmsPage,
  LotteryPage,
  PoolsPage,
  ProfilePage,
  TeamPage,
  TeamsPage,
  TradePage,
} from './pages';
import { useMst } from './store';

import './styles/index.scss';

const App: React.FC = observer(() => {
  const { tokens } = useMst();

  useEffect(() => {
    tokens.getTokens('default');
    tokens.getTokens('top');
    tokens.getTokens('extended');
    tokens.getTokens('imported');
  }, [tokens]);

  const { fetchUsdPrice } = useRefineryUsdPrice();
  useEffect(() => {
    fetchUsdPrice();
  }, [fetchUsdPrice]);

  return (
    <div className="ref-finance">
      <Header />
      <Switch>
        <Route
          exact
          path={[
            '/',
            '/liquidity',
            '/bridge',
            '/settings',
            '/history',
            '/liquidity/settings',
            '/liquidity/history',
            '/liquidity/find',
            '/liquidity/add',
            '/liquidity/add/:currencyIdA/:currencyIdB',
            '/liquidity/remove',
            '/liquidity/receive',
          ]}
          component={TradePage}
        />
        <Route exact path={['/lottery/:id', '/lottery']} component={LotteryPage} />
        <Route exact path="/farms" component={FarmsPage} />
        <Route exact path="/pools" component={PoolsPage} />
        {/* <Route exact path="/collectibles" component={CollectiblesPage} /> */}
        <Route exact path="/teams" component={TeamsPage} />
        <Route exact path="/team/:id" component={TeamPage} />
        <Route exact path="/dao" component={DaoListPage} />
        <Route strict exact path="/dao/:id" component={DaoPage} />
        <Route exact path="/dao/proposal/create" component={DaoProposalPage} />
        {/* <Route path="/create-profile" component={CreateProfilePage} /> */}
        <Route path="/profile" component={ProfilePage} />
      </Switch>
      <MetamaskErrModal />
      <RoiModal />
    </div>
  );
});

export default App;
