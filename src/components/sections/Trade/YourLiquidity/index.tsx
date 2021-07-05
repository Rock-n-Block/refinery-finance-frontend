import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLazyQuery, gql } from '@apollo/client';

import { TradeBox } from '..';
import { Button } from '../../../atoms';
import { useMst } from '../../../../store';

import './YourLiquidity.scss';

const USER_PAIRS = gql`
  query User($address: String!) {
    user(id: $address) {
      liquidityPositions {
        pair {
          name
          liquidityProviderCount
        }
        liquidityTokenBalance
      }
    }
  }
`;

const YourLiquidity: React.FC = observer(() => {
  const { user } = useMst();

  const [getUserLiquidities, { loading, error, data: userLiquidities }] = useLazyQuery(USER_PAIRS, {
    pollInterval: 60000,
  });
  console.log(loading, error, userLiquidities);

  React.useEffect(() => {
    if (user.address) {
      getUserLiquidities({
        variables: {
          address: user.address,
        },
      });
    }
  }, [user.address, getUserLiquidities]);

  return (
    <TradeBox
      className="y-liquidity"
      title="Your Liquidity"
      subtitle="Remove liquidity to receive tokens back"
      settingsLink="/trade/liquidity/settings"
      recentTxLink="/trade/liquidity/history"
    >
      <div className="y-liquidity__box">
        {user.address && loading ? 'Loading' : ''}

        {user.address && userLiquidities && userLiquidities.user.liquidityPositions.length
          ? userLiquidities.user.liquidityPositions.map((liquidity: any) => (
              <div key={liquidity.pair.name} className="y-liquidity__item">
                {liquidity.pair.name}
              </div>
            ))
          : ''}

        {user.address &&
        !loading &&
        (!userLiquidities || !userLiquidities.user.liquidityPositions.length) ? (
          <div className="text-center text-med text-purple box-f-fd-c box-f-ai-c">
            <div className="y-liquidity__text">No liquidity found.</div>
          </div>
        ) : (
          ''
        )}

        {!user.address ? (
          <div className="text-center text-med text-purple">
            Connect to a wallet to view your liquidity.
          </div>
        ) : (
          ''
        )}
      </div>
      <Button className="y-liquidity__btn" link="/trade/liquidity/add">
        <span className="text-md text-white text-bold">Add liquidity</span>
      </Button>
    </TradeBox>
  );
});

export default YourLiquidity;
