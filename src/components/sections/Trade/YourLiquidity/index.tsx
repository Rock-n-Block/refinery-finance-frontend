import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLazyQuery, gql } from '@apollo/client';
import { Scrollbar } from 'react-scrollbars-custom';

import { TradeBox, LiquidityInfoModal } from '..';
import { Button } from '../../../atoms';
import { useMst } from '../../../../store';
import { ILiquidityInfo } from '../../../../types';

import './YourLiquidity.scss';

import UnknownImg from '@/assets/img/currency/unknown.svg';

const USER_PAIRS = gql`
  query User($address: String!) {
    user(id: $address) {
      liquidityPositions {
        pair {
          id
          reserve0
          reserve1
          token0Price
          token1Price
          token0 {
            symbol
            decimals
            id
          }
          token1 {
            symbol
            decimals
            id
          }
        }
      }
    }
  }
`;

const YourLiquidity: React.FC = observer(() => {
  const { user } = useMst();

  const [getUserLiquidities, { loading, data: userLiquidities }] = useLazyQuery(USER_PAIRS, {
    pollInterval: 60000,
  });

  const [liquidityInfo, setLiquidityInfo] = React.useState<ILiquidityInfo | undefined>(undefined);

  const handleCloseLiquidityInfoModal = (): void => {
    setLiquidityInfo(undefined);
  };

  const handleOpenLiquidityInfoModal = (info: ILiquidityInfo): void => {
    setLiquidityInfo(info);
  };

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
    <>
      <TradeBox
        className="y-liquidity"
        title="Liquidity"
        subtitle="Add liquidity to receive LP tokens"
        settingsLink="/trade/liquidity/settings"
        recentTxLink="/trade/liquidity/history"
      >
        <Button className="y-liquidity__btn" link="/trade/liquidity/add">
          <span className="text-md text-white text-bold">Add liquidity</span>
        </Button>
        <div className="y-liquidity__title text-purple text-med text-md">Your Liquidity</div>
        <div className="y-liquidity__box">
          {user.address && loading ? 'Loading' : ''}

          {user.address && userLiquidities && userLiquidities.user.liquidityPositions.length ? (
            <Scrollbar
              className="recent-txs__scroll"
              style={{
                width: '100%',
                height:
                  userLiquidities.user.liquidityPositions.length > 3
                    ? '50vh'
                    : `${userLiquidities.user.liquidityPositions.length * 75}px`,
              }}
            >
              {userLiquidities.user.liquidityPositions.map((liquidity: any) => (
                <div
                  key={liquidity.pair.id}
                  className="y-liquidity__item box-f-ai-c box-pointer"
                  onClick={() =>
                    handleOpenLiquidityInfoModal({
                      address: liquidity.pair.id,
                      token0: {
                        address: liquidity.pair.token0.id,
                        symbol: liquidity.pair.token0.symbol,
                        balance: liquidity.pair.reserve0,
                        rate: liquidity.pair.token0Price,
                        decimals: liquidity.pair.token0.decimals,
                      },
                      token1: {
                        address: liquidity.pair.token1.id,
                        symbol: liquidity.pair.token1.symbol,
                        balance: liquidity.pair.reserve1,
                        rate: liquidity.pair.token1Price,
                        decimals: liquidity.pair.token1.decimals,
                      },
                    })
                  }
                  onKeyDown={() =>
                    handleOpenLiquidityInfoModal({
                      address: liquidity.pair.id,
                      token0: {
                        address: liquidity.pair.token0.id,
                        symbol: liquidity.pair.token0.symbol,
                        balance: liquidity.pair.reserve0,
                        rate: liquidity.pair.token0Price,
                        decimals: liquidity.pair.token0.decimals,
                      },
                      token1: {
                        address: liquidity.pair.token1.id,
                        symbol: liquidity.pair.token1.symbol,
                        balance: liquidity.pair.reserve1,
                        rate: liquidity.pair.token1Price,
                        decimals: liquidity.pair.token1.decimals,
                      },
                    })
                  }
                  role="button"
                  tabIndex={0}
                >
                  <img src={UnknownImg} alt="" />
                  <img src={UnknownImg} alt="" />
                  <span className="text-purple text-smd">{`${liquidity.pair.token0.symbol}/${liquidity.pair.token1.symbol}`}</span>
                </div>
              ))}
            </Scrollbar>
          ) : (
            ''
          )}

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
        <div className="text-gray">
          <p>Don&lsquo;t see a pool you joined?</p>
          <p>If you staked your LP tokens in a farm, unstake them to see them here.</p>
        </div>
      </TradeBox>
      <LiquidityInfoModal info={liquidityInfo} handleCloseModal={handleCloseLiquidityInfoModal} />
    </>
  );
});

export default YourLiquidity;
