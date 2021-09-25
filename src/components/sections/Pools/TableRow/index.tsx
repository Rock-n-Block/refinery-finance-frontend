import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';

import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import { Button } from '@/components/atoms';
import {
  AprColumn,
  EndsInColumn,
  RecentProfitColumn,
  TotalStakedColumn,
} from '@/components/sections/Pools/TableRow/Columns';
import { useMst } from '@/store';
import { useSelectVaultData } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';

import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import DetailsLinks from './DetailsLinks';
import RecentProfit from './RecentProfit';

import './TableRow.scss';
import { BIG_ZERO } from '@/utils';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { getFullDisplayBalance } from '@/utils/formatBalance';
import { convertSharesToRefinery } from '@/store/pools/helpers';

interface ITableRowProps {
  farmMode: IPoolFarmingMode;
  pool: Pool;
  columns: any[];
}

const mockData = {
  totalStaked: '1,662,947,888',
  totalBlocks: '1,663,423',
  currencyToConvert: 'USD',
};

const TableRow: React.FC<ITableRowProps> = observer(({ farmMode, pool, columns }) => {
  const { user, modals } = useMst();
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();
  const { earningToken, stakingToken, userData, apr } = pool;
  const { tokenUsdPrice: refineryUsdPrice } = useRefineryUsdPrice();

  const [isOpenDetails, setOpenDetails] = useState(false);
  const [MOCK_recentProfit, MOCK_setRecentProfit] = useState(0);

  const handleChangeDetails = (value: boolean): void => {
    setOpenDetails(value);
  };

  const handleToggleDetails = (): void => {
    setOpenDetails((isOpen) => !isOpen);
  };

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
    // TODO: POOLS TABLE ROW MODAL
    modals.roi.open({
      isFarmPage: false,
      apr: 5,
      tokenPrice: 1,
    });
  };

  const stakedValue = useMemo(() => {
    if (farmMode === PoolFarmingMode.auto) {
      const { refineryAsNumberBalance } = convertSharesToRefinery(
        userShares || BIG_ZERO,
        pricePerFullShare || BIG_ZERO,
      );
      return new BigNumber(refineryAsNumberBalance);
    }
    return userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO;
  }, [farmMode, pricePerFullShare, userShares, userData?.stakedBalance]);

  const stakedValueAsString = useMemo(
    () =>
      getFullDisplayBalance({
        balance: stakedValue,
        decimals: pool.stakingToken.decimals,
        displayDecimals: 5,
      }).toString(),
    [stakedValue, pool.stakingToken.decimals],
  );

  const nonAutoVaultEarnings = useMemo(() => {
    return userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO;
  }, [userData?.pendingReward]);
  const nonAutoVaultEarningsAsString = useMemo(() => nonAutoVaultEarnings.toString(), [
    nonAutoVaultEarnings,
  ]);

  const collectHandler = () => {
    modals.poolsCollect.open({
      poolId: pool.id,
      farmMode,
      earningTokenSymbol: pool.earningToken.symbol,
      earnings: nonAutoVaultEarningsAsString,
      earningTokenDecimals: Number(pool.earningToken.decimals),
      fullBalance: getFullDisplayBalance({
        balance: nonAutoVaultEarnings,
        decimals: pool.earningToken.decimals,
      }).toString(),
    });
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      MOCK_setRecentProfit(0.0003);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  const USD_IN_TOKEN = 27;
  // useEffect(() => {
  //   const
  //   MOCK_setConvertedRecentProfit(MOCK_recentProfit * USD_IN_TOKEN);
  // }, [MOCK_recentProfit]);

  const MOCK_convertedRecentProfit = useMemo(() => {
    return MOCK_recentProfit * USD_IN_TOKEN;
  }, [MOCK_recentProfit]);

  const convertedStakedValue = useMemo(() => {
    return new BigNumber(stakedValueAsString).times(refineryUsdPrice);
  }, [stakedValueAsString, refineryUsdPrice]);
  const convertedStakedValueAsString = useMemo(() => convertedStakedValue.toString(), [
    convertedStakedValue,
  ]);

  return (
    <div className="pools-table-row">
      <div
        className="pools-table-row__content"
        onClick={handleToggleDetails}
        onKeyDown={handleToggleDetails}
        role="button"
        tabIndex={0}
      >
        <div className="pools-table-row__currencies box-f-ai-c t-box-b">
          <div className="box pools-table-row__currencies-item">
            <img
              src={earningToken.logoURI}
              alt="currency"
              className="pools-table-row__currencies-item-image"
            />
          </div>
          <div className="box">
            <div className="text-smd">
              <span className="text-capitalize">{farmMode}</span>{' '}
              <span className="text-upper">{stakingToken.symbol}</span>
            </div>
            <div className="text-ssm text-gray-l-2">
              <span className="text-capitalize">stake</span>{' '}
              <span className="text-upper">{stakingToken.symbol}</span>
            </div>
          </div>
        </div>
        <RecentProfitColumn
          name={columns[0].name}
          value={MOCK_recentProfit}
          usdValue={MOCK_convertedRecentProfit}
        />
        <AprColumn name={columns[1].name} value={Number(apr)} modalHandler={handleOpenRoiModal} />
        <TotalStakedColumn value={mockData.totalStaked} onlyDesktop />
        <EndsInColumn value={mockData.totalBlocks} onlyDesktop />
        <div className="pools-table-row__item box-f-jc-e box-f">
          <div
            className={classNames('pools-table-row__item--mob t-box-b', {
              'pools-table-row__item--mob_active': isOpenDetails,
            })}
          >
            <img src={ArrowPurple} alt="arrow" />
          </div>
          <div className="pools-table-row__item--pc t-box-none">
            <Button
              colorScheme="outline-purple"
              size="smd"
              arrow
              toggle
              isActive={isOpenDetails}
              onToggle={handleChangeDetails}
            >
              <span>Details</span>
            </Button>
          </div>
        </div>
      </div>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isOpenDetails}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      >
        <div className="pools-table-row__details box-purple-l">
          <DetailsLinks farmMode={farmMode} />
          <div className="pools-table-row__buttons box-f-ai-c t-box-b">
            <RecentProfit
              farmMode={farmMode}
              tokenStake={stakingToken}
              value={MOCK_recentProfit}
              onCollect={collectHandler}
            />
            <div className="pools-table-row__details-box">
              {hasConnectedWallet && hasStakedValue ? (
                <>
                  <div className="pools-table-row__details-title text-ssm text-upper text-purple text-med">
                    {stakingToken.symbol} Staked {farmMode === PoolFarmingMode.auto && '(compounding)'}
                  </div>
                  <div className="box-f box-f-jc-sb box-f-ai-e">
                    <div className="pools-table-row__details-staked-values-group">
                      <div className="pools-table-row__details-staked-value text-blue-d text-smd">
                        {stakedValueAsString}
                      </div>
                      <div className="text-gray text-smd">
                        ~{convertedStakedValueAsString} {mockData.currencyToConvert}
                      </div>
                    </div>
                    <StakeUnstakeButtons pool={pool} />
                  </div>
                </>
              ) : (
                <StakingSection
                  pool={pool}
                  titleClassName="pools-table-row__details-title text-ssm text-upper"
                  buttonProps={{
                    className: 'pools-table-row__details-box-start-staking-button',
                    size: 'lg',
                  }}
                  tokenSymbol={stakingToken.symbol}
                  stakedValue={stakedValue}
                />
              )}
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
});

export default TableRow;
