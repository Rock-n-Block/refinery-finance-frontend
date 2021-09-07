import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import { Button } from '@/components/atoms';
import FarmingModeStatus from '@/components/sections/Pools/FarmingModeStatus';
import OpenLink from '@/components/sections/Pools/OpenLink';
import { useMst } from '@/store';
import { IPoolFarmingMode, IToken, PoolFarmingMode } from '@/types';

import 'antd/lib/select/style/css';

import CollectButton from '../CollectButton';
import { AutoFarmingPopover, ManualFarmingPopover, TotalStakedPopover } from '../Popovers';
import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import { durationFormatter } from './utils';

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

interface ITitleProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  tokenEarn?: IToken;
  tokenStake: IToken;
}

type ISubtitleProps = ITitleProps;

const mockData = {
  timeLeft: 2 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 31 * 60 * 1000,
};

const Title: React.FC<ITitleProps> = ({ className, farmMode, tokenStake, tokenEarn }) => {
  return (
    <div className={classNames(className, 'text-slg text-purple text-bold')}>
      <span className="text-capitalize">{farmMode}</span>{' '}
      {farmMode === PoolFarmingMode.manual && tokenEarn && (
        <span className="text-upper">{tokenEarn.symbol}</span>
      )}
      {farmMode === PoolFarmingMode.auto && <span className="text-upper">{tokenStake.symbol}</span>}
    </div>
  );
};

const Subtitle: React.FC<ISubtitleProps> = ({ className, farmMode, tokenStake, tokenEarn }) => {
  return (
    <div className={classNames(className, 'text-smd text-purple text-med')}>
      {farmMode === PoolFarmingMode.manual && tokenEarn && (
        <>
          <span className="capitalize">Earn</span> <span>{tokenEarn.symbol}</span>,{' '}
          <span>stake</span> <span className="text-upper">{tokenStake.symbol}</span>
        </>
      )}
      {farmMode === PoolFarmingMode.auto && 'Automatic restaking'}
      {farmMode === PoolFarmingMode.earn && `Stake ${tokenStake.symbol}`}
    </div>
  );
};

const Details: React.FC<{ tokenStake: IToken }> = React.memo(({ tokenStake }) => {
  const mockDetailsData = { totalStaked: '78,790,501', performanceFee: 2 };
  const { totalStaked, performanceFee } = mockDetailsData;
  const items = [
    {
      title: 'Total staked:',
      value: (
        <>
          <span>{totalStaked}</span>
          <TotalStakedPopover symbol={tokenStake.symbol} />
        </>
      ),
    },
    {
      title: 'Performance Fee:',
      value: <>{performanceFee}%</>,
    },
  ];

  const links = [
    {
      href: '/',
      text: 'View Project Site',
    },
    {
      href: '/',
      text: 'View Contract',
    },
  ];
  return (
    <div className="p-card__details">
      {items.map(({ title, value }) => {
        return (
          <div key={title} className="p-card__details-item box-f-ai-c box-f-jc-sb ">
            <div className="p-card__details-item-name text-smd text-purple text-med">{title}</div>
            <div className="p-card__details-item-value text-smd box-f-ai-c">{value}</div>
          </div>
        );
      })}
      {links.map(({ href, text }) => (
        <OpenLink key={href + text} className="p-card__details-item" href={href} text={text} />
      ))}
    </div>
  );
});

const PoolCard: React.FC<IPoolCard> = observer(
  ({ className, tokenEarn, tokenStake, type, apr }) => {
    const { modals, user } = useMst();

    const [MOCK_recentProfit, MOCK_setRecentProfit] = useState(0);
    const [MOCK_convertedRecentProfit, MOCK_setConvertedRecentProfit] = useState(0);
    const [MOCK_timeLeft, MOCK_setTimeLeft] = useState(mockData.timeLeft);
    const [MOCK_convertedStakedValue, MOCK_setConvertedStakedValue] = useState(0);

    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);

    const handleOpenApr = (): void => {
      modals.roi.open(apr.items);
    };

    const collectHandler = () => {
      MOCK_setRecentProfit(0);
    };

    const hasConnectedWallet = Boolean(user.address);
    const hasStakedValue = Boolean(modals.stakeUnstake.stakedValue);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        MOCK_setRecentProfit(0.0003);
      }, 2000);
      return () => {
        clearTimeout(timeoutId);
      };
    }, []);

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (MOCK_timeLeft === 0) clearInterval(intervalId);
        MOCK_setTimeLeft(MOCK_timeLeft - 60 * 1000);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }, [MOCK_timeLeft]);

    useEffect(() => {
      const USD_IN_TOKEN = 27;
      MOCK_setConvertedRecentProfit(MOCK_recentProfit * USD_IN_TOKEN);
    }, [MOCK_recentProfit]);

    useEffect(() => {
      const USD_IN_TOKEN = 27;
      MOCK_setConvertedStakedValue(modals.stakeUnstake.stakedValue * USD_IN_TOKEN);
    }, [modals.stakeUnstake.stakedValue]);

    return (
      <div className={classNames('p-card box-shadow', className)}>
        <div className="p-card__head box-f-ai-c box-f-jc-sb">
          <div>
            <Title
              className="p-card__title"
              farmMode={type}
              tokenStake={tokenStake}
              tokenEarn={tokenEarn}
            />
            <Subtitle
              className="p-card__subtitle"
              farmMode={type}
              tokenStake={tokenStake}
              tokenEarn={tokenEarn}
            />
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
          {hasConnectedWallet && type === PoolFarmingMode.auto && !hasStakedValue && (
            <div className="p-card__auto">
              <div className="p-card__auto-title text-purple text-smd text-med">
                Recent {tokenStake.name} profit:
              </div>
              <div className="p-card__auto-profit text-smd text-blue-d">
                0.1% unstaking fee if withdrawn within 72h
              </div>
            </div>
          )}
          {hasConnectedWallet && type === PoolFarmingMode.auto && hasStakedValue && (
            <div className="p-card__auto">
              <div className="p-card__auto-title box-f box-f-jc-sb text-purple text-smd text-med">
                <div className="">Recent {tokenStake.name} profit:</div>
                <div>{MOCK_recentProfit}</div>
              </div>

              <div className="p-card__auto-profit box-f box-f-jc-sb">
                <div className="p-card__auto-info text-smd text-blue-d">
                  0.1% unstaking fee if withdrawn within 72h
                </div>
                <div className="text-purple text-smd text-med">
                  {durationFormatter(MOCK_timeLeft)}
                </div>
              </div>
            </div>
          )}
          {hasConnectedWallet && type === PoolFarmingMode.earn && tokenEarn && (
            <>
              <div className="p-card__earned box-f box-f-jc-sb">
                <div>
                  <div className="text-smd text-purple text-med">{tokenEarn.symbol} Earned</div>
                  <div className="p-card__earned-profit-value text-blue-d text-smd">
                    {MOCK_recentProfit}
                  </div>
                  <div className="text-gray text-smd">~{MOCK_convertedRecentProfit} USD</div>
                </div>
                <CollectButton value={MOCK_recentProfit} collectHandler={collectHandler} />
              </div>
            </>
          )}
          {hasConnectedWallet && hasStakedValue ? (
            <div className="p-card__staked">
              <div className="text-smd text-purple text-med">
                {tokenStake.symbol} Staked {type === PoolFarmingMode.auto && '(compounding)'}
              </div>
              <div className="box-f box-f-jc-sb box-f-ai-e">
                <div>
                  <div className="p-card__staked-value text-blue-d text-smd">
                    {modals.stakeUnstake.stakedValue}
                  </div>
                  <div className="text-gray text-smd">~{MOCK_convertedStakedValue} USD</div>
                </div>
                <StakeUnstakeButtons />
              </div>
            </div>
          ) : (
            <StakingSection
              titleClassName="p-card__unlock-text text-smd text-capitalize"
              buttonProps={{
                className: 'p-card__unlock-btn',
              }}
              tokenSymbol={tokenStake.symbol}
            />
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
            <Details tokenStake={tokenStake} />
          </CSSTransition>
        </div>
      </div>
    );
  },
);

export default PoolCard;
