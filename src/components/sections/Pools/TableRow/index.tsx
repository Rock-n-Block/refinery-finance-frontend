import React, { useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import { Button } from '@/components/atoms';
import {
  AprColumn,
  EndsInColumn,
  RecentProfitColumn,
  TotalStakedColumn,
} from '@/components/sections/Pools/TableRow/Columns';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useBlock } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { convertSharesToRefinery, getRefineryVaultEarnings } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { BIG_ZERO, feeFormatter, loadingDataFormatter, numberWithCommas } from '@/utils';
import { getBalanceAmount, getFullDisplayBalance } from '@/utils/formatBalance';

import { getAprData, getPoolBlockInfo, useNonAutoVaultEarnings } from '../PoolCard/utils';
import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import DetailsLinks from './DetailsLinks';
import RecentProfit from './RecentProfit';
import TableRowSubtitle from './TableRowSubtitle';
import TableRowTitle from './TableRowTitle';

import './TableRow.scss';

interface ITableRowProps {
  farmMode: IPoolFarmingMode;
  pool: Pool;
  columns: any[];
}

const mockData = {
  currencyToConvert: 'USD',
};

const TableRow: React.FC<ITableRowProps> = observer(({ farmMode, pool, columns }) => {
  const {
    user,
    modals,
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
  const {
    pricePerFullShare,
    userData: { userShares, refineryAtLastUserAction },
    totalRefineryInVault,
  } = useSelectVaultData();
  const { earningToken, stakingToken, userData, apr, earningTokenPrice, totalStaked } = pool;
  const { tokenUsdPrice: refineryUsdPrice } = useRefineryUsdPrice();

  const [isOpenDetails, setOpenDetails] = useState(false);

  const handleChangeDetails = (value: boolean): void => {
    setOpenDetails(value);
  };
  const handleToggleDetails = (): void => {
    setOpenDetails((isOpen) => !isOpen);
  };

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
    modals.roi.open({
      isFarmPage: false,
      apr: apr || 0,
      tokenPrice: earningTokenPrice || 0,
    });
  };

  // TODO: 'autoCompoundFrequency' from `getAprData` use to calculate APR/APY
  const { apr: earningsPercentageToDisplay } = getAprData(
    pool,
    farmMode === PoolFarmingMode.auto ? Number(feeFormatter(performanceFee)) : 0,
  );

  const totalStakedBalance = useMemo(() => {
    switch (farmMode) {
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
  }, [farmMode, stakingToken.decimals, totalRefineryInVault, totalStaked]);

  const stakedValue = useMemo(() => {
    if (farmMode === PoolFarmingMode.auto) {
      const { refineryAsBigNumber } = convertSharesToRefinery(
        userShares || BIG_ZERO,
        pricePerFullShare || BIG_ZERO,
      );
      return refineryAsBigNumber;
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

  const { nonAutoVaultEarnings, nonAutoVaultEarningsAsString } = useNonAutoVaultEarnings(pool);

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

  const convertedStakedValue = useMemo(() => {
    return new BigNumber(stakedValueAsString).times(refineryUsdPrice);
  }, [stakedValueAsString, refineryUsdPrice]);
  const convertedStakedValueAsString = useMemo(() => convertedStakedValue.toString(), [
    convertedStakedValue,
  ]);

  const recentProfit = useMemo(() => {
    if (farmMode === PoolFarmingMode.auto) {
      const {
        // hasAutoEarnings,
        autoRefineryToDisplay: autoRefineryVaultRecentProfit,
      } = getRefineryVaultEarnings(
        user.address,
        refineryAtLastUserAction || BIG_ZERO,
        userShares || BIG_ZERO,
        pricePerFullShare || BIG_ZERO,
      );
      return autoRefineryVaultRecentProfit;
    }
    return getBalanceAmount(nonAutoVaultEarnings, pool.earningToken.decimals);
  }, [
    farmMode,
    pricePerFullShare,
    refineryAtLastUserAction,
    user.address,
    userShares,
    nonAutoVaultEarnings,
    pool.earningToken.decimals,
  ]);

  const convertedRecentProfit = useMemo(() => {
    return recentProfit * refineryUsdPrice;
  }, [recentProfit, refineryUsdPrice]);

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
            <TableRowTitle farmMode={farmMode} tokenEarn={earningToken} />
            <TableRowSubtitle
              farmMode={farmMode}
              tokenEarn={earningToken}
              tokenStake={stakingToken}
            />
          </div>
        </div>
        <RecentProfitColumn
          name={columns[0].name}
          value={Number(recentProfit.toFixed(7))}
          usdValue={Number(convertedRecentProfit.toFixed(7))}
        />
        <AprColumn
          name={columns[1].name}
          value={earningsPercentageToDisplay}
          modalHandler={handleOpenRoiModal}
        />
        <TotalStakedColumn
          value={Number(totalStakedBalance).toFixed(7)}
          currencySymbol={stakingToken.symbol}
          onlyDesktop
        />
        <EndsInColumn
          value={shouldShowBlockCountdown ? numberWithCommas(blocksToDisplay) : ''}
          onlyDesktop
        />
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
          <DetailsLinks farmMode={farmMode} pool={pool} />
          <div className="pools-table-row__buttons box-f-ai-c t-box-b">
            <RecentProfit
              farmMode={farmMode}
              tokenStake={stakingToken}
              value={recentProfit}
              onCollect={collectHandler}
            />
            <div className="pools-table-row__details-box">
              {hasConnectedWallet && hasStakedValue ? (
                <>
                  <div className="pools-table-row__details-title text-ssm text-upper text-purple text-med">
                    {stakingToken.symbol} Staked{' '}
                    {farmMode === PoolFarmingMode.auto && '(compounding)'}
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
