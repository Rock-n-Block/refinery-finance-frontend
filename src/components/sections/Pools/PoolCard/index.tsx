import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
// import { getBalanceAmount } from '@/utils/formatBalance';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import { Button } from '@/components/atoms';
import FarmingModeStatus from '@/components/sections/Pools/FarmingModeStatus';
import OpenLink from '@/components/sections/Pools/OpenLink';
import { getAddress, getContractAddress } from '@/services/web3/contractHelpers';
import { useBlock } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { useSelectVaultData } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode, Token } from '@/types';
import { BIG_ZERO, feeFormatter, loadingDataFormatter, numberWithCommas } from '@/utils';

import 'antd/lib/select/style/css';

import CollectButton from '../CollectButton';
import { AutoFarmingPopover, ManualFarmingPopover, TotalStakedPopover } from '../Popovers';
import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import { durationFormatter, getAprData, getPoolBlockInfo, secondsToHoursFormatter } from './utils';

import './PoolCard.scss';

// interface IAPR {
//   timeframe: string;
//   roi: number | string;
//   rf: number | string;
// }

export interface IPoolCard {
  className?: string;
  // tokenEarn?: IToken;
  // tokenStake: IToken;
  farmMode: IPoolFarmingMode;
  pool: Pool;
  // apr: {
  //   value: number | string;
  //   items: IAPR[];
  // };
}

interface ITitleProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  tokenEarn: Token;
  tokenStake: Token;
}

type ISubtitleProps = ITitleProps;

const mockData = {
  timeLeft: 2 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 31 * 60 * 1000,
};

const Title: React.FC<ITitleProps> = React.memo(({ className, farmMode, tokenEarn }) => {
  return (
    <div className={classNames(className, 'text-slg text-purple text-bold')}>
      <span className="text-capitalize">{farmMode}</span>{' '}
      <span className="text-upper">{tokenEarn.symbol}</span>
    </div>
  );
});

const Subtitle: React.FC<ISubtitleProps> = React.memo(
  ({ className, farmMode, tokenStake, tokenEarn }) => {
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
  },
);

const Details: React.FC<{ type: IPoolFarmingMode; pool: Pool }> = observer(({ pool, type }) => {
  const {
    pools: {
      fees: { performanceFee },
    },
  } = useMst();
  const [currentBlock] = useBlock();
  const {
    shouldShowBlockCountdown,
    // blocksUntilStart,
    // blocksRemaining,
    // hasPoolStarted,
    blocksToDisplay,
  } = getPoolBlockInfo(pool, currentBlock);
  const { totalRefineryInVault } = useSelectVaultData();
  const { earningToken, stakingToken, totalStaked } = pool;
  // const mockDetailsData = { totalStaked: '78,790,501' };
  // const { totalStaked } = mockDetailsData;
  const totalStakedBalance = useMemo(() => {
    switch (type) {
      case PoolFarmingMode.auto:
        return loadingDataFormatter(totalRefineryInVault, { decimals: stakingToken.decimals });
      case PoolFarmingMode.manual: {
        if (!totalStaked || !totalRefineryInVault) return loadingDataFormatter();
        return loadingDataFormatter(new BigNumber(totalStaked).minus(totalRefineryInVault), {
          decimals: stakingToken.decimals,
        });
      }
      case PoolFarmingMode.earn:
      default:
        return loadingDataFormatter(totalStaked, { decimals: stakingToken.decimals });
    }
  }, [type, stakingToken.decimals, totalRefineryInVault, totalStaked]);
  const performanceRow = useMemo(() => {
    return type === PoolFarmingMode.auto
      ? [
          {
            title: 'Performance Fee:',
            value: <>{feeFormatter(performanceFee)}%</>,
          },
        ]
      : [];
  }, [performanceFee, type]);

  const endsInRow = useMemo(() => {
    return shouldShowBlockCountdown
      ? [
          {
            title: 'Ends in:',
            value: (
              <>
                <span>{numberWithCommas(blocksToDisplay)} blocks</span>
                {/* TODO: copy/paste value like in table row */}
              </>
            ),
          },
        ]
      : [];
  }, [shouldShowBlockCountdown, blocksToDisplay]);
  const items = [
    {
      title: 'Total staked:',
      value: (
        <>
          <span>{totalStakedBalance}</span>
          <TotalStakedPopover symbol={stakingToken.symbol} />
        </>
      ),
    },
    ...performanceRow,
    ...endsInRow,
  ];
  const links = [
    {
      href: `/token/${earningToken.address ? getAddress(earningToken.address) : ''}`,
      text: 'See Token Info',
    },
    {
      href: earningToken.projectLink,
      text: 'View Project Site',
    },
    {
      href: `https://bscscan.com/address/${
        type === PoolFarmingMode.auto
          ? getContractAddress('REFINERY_VAULT')
          : getAddress(pool.contractAddress)
      }`,
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

const TextUnstakingFee: React.FC<{ className?: string }> = observer(({ className }) => {
  const {
    pools: {
      fees: { withdrawalFee, withdrawalFeePeriod },
    },
  } = useMst();
  return (
    <div className={classNames(className, 'text-smd text-blue-d')}>
      {feeFormatter(withdrawalFee)}% unstaking fee if withdrawn within{' '}
      {secondsToHoursFormatter(withdrawalFeePeriod)}
    </div>
  );
});

const PoolCard: React.FC<IPoolCard> = observer(({ className, farmMode, pool }) => {
  const {
    modals,
    user,
    pools: {
      fees: { performanceFee },
    },
  } = useMst();
  const {
    userData: { userShares },
  } = useSelectVaultData();
  const { earningToken, stakingToken, userData } = pool;

  const [MOCK_recentProfit, MOCK_setRecentProfit] = useState(0);
  const [MOCK_timeLeft, MOCK_setTimeLeft] = useState(mockData.timeLeft);

  const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);

  const handleOpenApr = (): void => {
    // interface IAPR {
    //   timeframe: string;
    //   roi: number | string;
    //   rf: number | string;
    // }
    modals.roi.open([]);
  };

  // TODO: 'autoCompoundFrequency' from `getAprData` use to calculate APR/APY
  const { apr: earningsPercentageToDisplay } = getAprData(
    pool,
    farmMode === PoolFarmingMode.auto ? Number(feeFormatter(performanceFee)) : 0,
  );

  const harvestHandler = () => {};

  const collectHandler = () => {
    MOCK_setRecentProfit(0);
  };

  const hasConnectedWallet = Boolean(user.address);

  const hasStakedValue = useMemo(() => {
    if (farmMode === PoolFarmingMode.auto) {
      return userShares && userShares.gt(0);
    }
    const stakedBalance = userData?.stakedBalance
      ? new BigNumber(userData.stakedBalance)
      : BIG_ZERO;
    return stakedBalance.gt(0);
  }, [farmMode, userData?.stakedBalance, userShares]);

  // const hasStakedValue = Boolean(modals.stakeUnstake.stakedValue);

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

  const USD_IN_TOKEN = 27;

  const MOCK_convertedStakedValue = useMemo(() => {
    return modals.stakeUnstake.stakedValue * USD_IN_TOKEN;
  }, [modals.stakeUnstake.stakedValue]);

  const MOCK_convertedRecentProfit = useMemo(() => {
    return MOCK_recentProfit * USD_IN_TOKEN;
  }, [MOCK_recentProfit]);

  return (
    <div className={classNames('p-card box-shadow', className)}>
      <div className="p-card__head box-f-ai-c box-f-jc-sb">
        <div>
          <Title
            className="p-card__title"
            farmMode={farmMode}
            tokenStake={stakingToken}
            tokenEarn={earningToken}
          />
          <Subtitle
            className="p-card__subtitle"
            farmMode={farmMode}
            tokenStake={stakingToken}
            tokenEarn={earningToken}
          />
        </div>
        <div className="p-card__icons">
          {earningToken && <img src={earningToken.logoURI} alt="" />}
          <img src={stakingToken.logoURI} alt="" />
        </div>
      </div>
      <div className="p-card__apr p-card__box box-f-ai-c box-f-jc-sb">
        <span className="text-smd text-purple text-med text-upper">
          {farmMode === PoolFarmingMode.auto ? 'apy' : 'apr'}
        </span>
        {/* TODO: APR APY modal */}
        <div
          className="p-card__apr-percent box-pointer"
          onClick={handleOpenApr}
          onKeyDown={handleOpenApr}
          role="button"
          tabIndex={0}
        >
          <span className="text-smd">{earningsPercentageToDisplay}%</span>
          {/* <span className="text-smd">{Number(apr).toFixed(2).replace('.', ',')}%</span> */}
          <img src={CalcImg} alt="calculator" />
        </div>
      </div>
      <div className="p-card__box p-card__content">
        {hasConnectedWallet && farmMode === PoolFarmingMode.auto && !hasStakedValue && (
          <div className="p-card__auto">
            <div className="p-card__auto-title text-purple text-smd text-med">
              Recent {stakingToken.symbol} profit:
            </div>
            <TextUnstakingFee className="p-card__auto-profit" />
          </div>
        )}
        {hasConnectedWallet && farmMode === PoolFarmingMode.auto && hasStakedValue && (
          <div className="p-card__auto">
            <div className="p-card__auto-title box-f box-f-jc-sb text-purple text-smd text-med">
              <div className="">Recent {stakingToken.symbol} profit:</div>
              <div>{MOCK_recentProfit}</div>
            </div>

            <div className="p-card__auto-profit box-f box-f-jc-sb">
              <TextUnstakingFee className="p-card__auto-info" />
              <div className="text-purple text-smd text-med">
                {durationFormatter(MOCK_timeLeft)}
              </div>
            </div>
          </div>
        )}
        {hasConnectedWallet &&
          (farmMode === PoolFarmingMode.earn || farmMode === PoolFarmingMode.manual) && (
            <>
              <div className="p-card__earned box-f box-f-jc-sb">
                <div>
                  <div className="text-smd text-purple text-med">{earningToken.symbol} Earned</div>
                  <div className="p-card__earned-profit-value text-blue-d text-smd">
                    {MOCK_recentProfit}
                  </div>
                  <div className="text-gray text-smd">~{MOCK_convertedRecentProfit} USD</div>
                </div>
                <CollectButton
                  farmMode={farmMode}
                  value={MOCK_recentProfit}
                  collectHandler={
                    farmMode === PoolFarmingMode.earn ? harvestHandler : collectHandler
                  }
                />
              </div>
            </>
          )}
        {hasConnectedWallet && hasStakedValue ? (
          <div className="p-card__staked">
            <div className="text-smd text-purple text-med">
              {stakingToken.symbol} Staked {farmMode === PoolFarmingMode.auto && '(compounding)'}
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
            pool={pool}
            titleClassName="p-card__unlock-text text-smd text-capitalize"
            buttonProps={{
              className: 'p-card__unlock-btn',
            }}
            tokenSymbol={stakingToken.symbol}
          />
        )}
      </div>
      <div className="p-card__box p-card__footer">
        <div className="box-f-ai-c box-f-jc-sb">
          <FarmingModeStatus type={farmMode} />
          {farmMode === PoolFarmingMode.auto ? (
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
            <span className="text text-med text-purple">{isDetailsOpen ? 'Hide' : 'Details'}</span>
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
          <Details pool={pool} type={farmMode} />
        </CSSTransition>
      </div>
    </div>
  );
});

export default PoolCard;
