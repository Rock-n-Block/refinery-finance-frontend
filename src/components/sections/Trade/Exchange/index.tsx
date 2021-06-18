import React from 'react';
import { observer } from 'mobx-react-lite';

import { TradeBox, ChooseTokens } from '..';
import { IChooseTokens } from '../ChooseTokens';
import { Button } from '../../../atoms';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';

import './Exchange.scss';

const Exchange: React.FC<IChooseTokens> = observer((props) => {
  const connector = useWalletConnectorContext();
  const { user } = useMst();

  return (
    <>
      <TradeBox
        title="Exchange"
        subtitle="Trade tokens in an instant"
        settingsLink="/trade/swap/settings"
        recentTxLink="/trade/swap/history"
      >
        <ChooseTokens {...props} />
        {user.address ? (
          <Button className="exchange__btn">
            <span className="text-bold text-md text-white">Swap</span>
          </Button>
        ) : (
          <Button className="exchange__btn" onClick={connector.connect}>
            <span className="text-bold text-md text-white">Connect</span>
          </Button>
        )}
      </TradeBox>
    </>
  );
});

export default Exchange;
