import React from 'react';
import { observer } from 'mobx-react-lite';

import { TradeBox } from '..';
import { Button } from '../../../atoms';
import { useMst } from '../../../../store';

import './YourLiquidity.scss';

const YourLiquidity: React.FC = observer(() => {
  const { user } = useMst();

  return (
    <TradeBox
      className="y-liquidity"
      title="Your Liquidity"
      subtitle="Remove liquidity to receive tokens back"
      settingsLink="/trade/liquidity/settings"
      recentTxLink="/trade/liquidity/history"
    >
      <div className="y-liquidity__box">
        {user.address ? (
          <div className="text-center text-med text-purple box-f-fd-c box-f-ai-c">
            <div className="y-liquidity__text">No liquidity found.</div>
            <div className="y-liquidity__text">Don&apos;t see a pool you joined ?</div>
            <Button colorScheme="outline-purple" size="ssm" link="/trade/liquidity/find">
              <span>Find other LP tokens</span>
            </Button>
          </div>
        ) : (
          <div className="text-center text-med text-purple">
            Connect to a wallet to view your liquidity.
          </div>
        )}
      </div>
      <Button className="y-liquidity__btn" link="/trade/liquidity/add">
        <span className="text-md text-white text-bold">Add liquidity</span>
      </Button>
    </TradeBox>
  );
});

export default YourLiquidity;
