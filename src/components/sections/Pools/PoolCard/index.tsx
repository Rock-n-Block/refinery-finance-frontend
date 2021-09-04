import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import { Button } from '@/components/atoms';
import FarmingModeStatus from '@/components/sections/Pools/FarmingModeStatus';
import OpenLink from '@/components/sections/Pools/OpenLink';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { IPoolFarmingMode, IToken, PoolFarmingMode } from '@/types';

import 'antd/lib/select/style/css';

import { AutoFarmingPopover, ManualFarmingPopover, TotalStakedPopover } from '../Popovers';

import './PoolCard.scss';

interface IAPR {
  timeframe: string;
  roi: number | string;
  rf: number | string;
}

export interface IPoolCard {
  className?: string;
  tokenEarn?: IToken;
  tokenStake: IToken;
  type: IPoolFarmingMode;
  apr: {
    value: number | string;
    items: IAPR[];
  };
}

const mockData = {
  totalStaked: '78,790,501',
  performanceFee: 2,
};

const PoolCard: React.FC<IPoolCard> = observer(
  ({ className, tokenEarn, tokenStake, type, apr }) => {
    const { metamaskService } = useWalletConnectorContext();
    const { modals, user } = useMst();

    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);

    const handleOpenApr = (): void => {
      modals.roi.open(apr.items);
    };

    return (
      <div className={classNames('p-card box-shadow', className)}>
        <div className="p-card__head box-f-ai-c box-f-jc-sb">
          <div>
            <div className="p-card__title text-slg text-purple text-bold">
              <span className="text-capitalize">{type}</span>{' '}
              {type === 'manual' && tokenEarn && (
                <span className="text-upper">{tokenEarn.name}</span>
              )}
              {type === 'auto' && <span className="text-upper">{tokenStake.name}</span>}
            </div>
            <div className="p-card__subtitle text-smd text-purple text-med">
              {type === 'manual' && tokenEarn && (
                <>
                  <span className="capitalize">Earn</span> <span>{tokenEarn.name}</span>,{' '}
                  <span>stake</span> <span className="text-upper">{tokenStake.name}</span>
                </>
              )}
              {type === 'auto' && 'Automatic restaking'}
              {type === 'earn' && `Stake ${tokenStake.name}`}
            </div>
          </div>
          <div className="p-card__icons">
            {tokenEarn && <img src={tokenEarn.logoURI} alt="" />}
            <img src={tokenStake.logoURI} alt="" />
          </div>
        </div>
        <div className="p-card__apr p-card__box box-f-ai-c box-f-jc-sb">
          <span className="text-smd text-purple text-med text-upper">
            {type === PoolFarmingMode.auto ? 'apy' : 'apr'}
          </span>
          <div
            className="p-card__apr-percent box-pointer"
            onClick={handleOpenApr}
            onKeyDown={handleOpenApr}
            role="button"
            tabIndex={0}
          >
            <span className="text-smd">{Number(apr.value).toFixed(2).replace('.', ',')}%</span>
            <img src={CalcImg} alt="calculator" />
          </div>
        </div>
        <div className="p-card__box p-card__content">
          {user.address && type === 'auto' && (
            <div className="p-card__auto">
              <div className="p-card__auto-title text-purple text-smd text-med">
                Recent {tokenStake.name} profit:
              </div>
              <div className="p-card__auto-profit text-smd text-blue-d">
                0.1% unstaking fee if withdrawn within 72h
              </div>
            </div>
          )}
          {user.address && type === 'earn' && tokenEarn && (
            <>
              <div className="p-card__earned box-f box-f-jc-sb">
                <div>
                  <div className="text-smd text-purple text-med">{tokenEarn.name} Earned</div>
                  <div className="p-card__earned-numb text-blue-d text-smd">0</div>
                  <div className="text-gray text-smd">~ 0 USD</div>
                </div>
                <Button colorScheme="yellow" size="smd" disabled>
                  <span className="text-white text">Collect</span>
                </Button>
                <Button colorScheme="yellow" size="smd">
                  <span className="text-white text">Collect</span>
                </Button>
              </div>
            </>
          )}
          {user.address && (
            <>
              <div className="text-purple text-med text-smd p-card__unlock-text">Start Farming</div>
              <Button className="p-card__unlock-btn">
                <span className="text-white text-smd text-bold">Enable</span>
              </Button>
            </>
          )}
          {!user.address && (
            <div className="p-card__unlock">
              <div className="text-purple text-med text-smd p-card__unlock-text">Start Earning</div>
              <Button className="p-card__unlock-btn" onClick={() => metamaskService.connect()}>
                <span className="text-white text-smd text-bold">Unlock Wallet</span>
              </Button>
            </div>
          )}
        </div>
        <div className="p-card__box p-card__footer">
          <div className="box-f-ai-c box-f-jc-sb">
            <FarmingModeStatus type={type} />
            {type === PoolFarmingMode.auto ? (
              <AutoFarmingPopover className="p-card__footer-info-popover" />
            ) : (
              <ManualFarmingPopover className="p-card__footer-info-popover" />
            )}
            <Button
              toggle
              size="smd"
              colorScheme="outline-purple"
              arrow
              isActive={isDetailsOpen}
              onToggle={(value) => setDetailsOpen(value)}
            >
              <span className="text text-med text-purple">
                {isDetailsOpen ? 'Hide' : 'Details'}
              </span>
            </Button>
          </div>
          <CSSTransition
            unmountOnExit
            mountOnEnter
            in={isDetailsOpen}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
            }}
            classNames="show"
          >
            <div className="p-card__details">
              <div className="p-card__details-item box-f-ai-c box-f-jc-sb ">
                <div className="p-card__details-item-name text-smd text-purple text-med">
                  Total staked:
                </div>
                <div className="p-card__details-item-value text-smd box-f-ai-c">
                  <span>{mockData.totalStaked}</span>
                  <TotalStakedPopover symbol={tokenStake.symbol} />
                </div>
              </div>
              <div className="p-card__details-item box-f-ai-c box-f-jc-sb ">
                <div className="p-card__details-item-name text-smd text-purple text-med">
                  Performance Fee:
                </div>
                <div className="p-card__details-item-value text-smd box-f-ai-c">
                  {mockData.performanceFee}%
                </div>
              </div>
              <OpenLink className="p-card__details-item" href="/" text="View Project Site" />
              <OpenLink className="p-card__details-item" href="/" text="View Contract" />
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  },
);

export default PoolCard;
