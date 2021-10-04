import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useMst } from '@/store';
import { getStakingBalance } from '@/store/pools/helpers';
import { useSelectVaultData, useStakedValue } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { BIG_ZERO, feeFormatter } from '@/utils';
import { getFullDisplayBalance } from '@/utils/formatBalance';

import 'antd/lib/select/style/css';

import CollectButton from '../CollectButton';
import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import AutoVaultRecentProfitSection from './AutoVaultRecentProfitSection';
import CardFooter from './CardFooter';
import CardSubtitle from './CardSubtitle';
import CardTitle from './CardTitle';
import { getAprData, useNonAutoVaultEarnings } from './utils';

import './PoolCard.scss';

export interface IPoolCard {
  className?: string;
  farmMode: IPoolFarmingMode;
  pool: Pool;
}

const mockData = {
  currencyToConvert: 'USD',
};

const PoolCard: React.FC<IPoolCard> = observer(({ className, farmMode, pool }) => {
  const {
    modals,
    user,
    pools: {
      fees: { performanceFee: globalPerformanceFee },
    },
  } = useMst();
  const {
    userData: { userShares },
  } = useSelectVaultData();
  const { earningToken, stakingToken, userData, apr, earningTokenPrice, stakingTokenPrice } = pool;
  const { tokenUsdPrice: refineryUsdPrice } = useRefineryUsdPrice();

  const performanceFee =
    farmMode === PoolFarmingMode.auto ? Number(feeFormatter(globalPerformanceFee)) : 0;
  const { apr: earningsPercentageToDisplay, autoCompoundFrequency } = getAprData(
    pool,
    performanceFee,
  );

  const stakedValue = useStakedValue(farmMode, pool);
  const stakingTokenBalance = stakedValue.plus(getStakingBalance(pool));

  const handleOpenApr = (e: any): void => {
    e.stopPropagation();
    modals.roi.open({
      isFarmPage: false,
      autoCompoundFrequency,
      performanceFee,
      apr: apr || 0,
      earningTokenSymbol: earningToken.symbol,
      earningTokenPrice: earningTokenPrice || 0,
      stakingTokenSymbol: stakingToken.symbol,
      stakingTokenPrice: Number(stakingTokenPrice),
      stakingTokenBalance: stakingTokenBalance.toString(),
    });
  };

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

  const convertedNonAutoVaultEarnings = useMemo(() => {
    return nonAutoVaultEarnings.times(refineryUsdPrice);
  }, [nonAutoVaultEarnings, refineryUsdPrice]);

  // const convertedNonAutoVaultEarningsAsString = useMemo(
  //   () => convertedNonAutoVaultEarnings.toString(),
  //   [convertedNonAutoVaultEarnings],
  // );

  return (
    <div className={classNames('p-card box-shadow', className)}>
      <div className="p-card__head box-f-ai-c box-f-jc-sb">
        <div>
          <CardTitle
            className="p-card__title"
            farmMode={farmMode}
            tokenStake={stakingToken}
            tokenEarn={earningToken}
          />
          <CardSubtitle
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
        {farmMode === PoolFarmingMode.auto && (
          <AutoVaultRecentProfitSection
            hasStakedValue={Boolean(hasStakedValue)}
            stakingTokenSymbol={stakingToken.symbol}
          />
        )}
        {hasConnectedWallet &&
          (farmMode === PoolFarmingMode.earn || farmMode === PoolFarmingMode.manual) && (
            <>
              <div className="p-card__earned box-f box-f-jc-sb">
                <div>
                  <div className="text-smd text-purple text-med">{earningToken.symbol} Earned</div>
                  <div className="p-card__earned-profit-value text-blue-d text-smd">
                    {getFullDisplayBalance({
                      balance: nonAutoVaultEarnings,
                      decimals: pool.earningToken.decimals,
                      // displayDecimals: 8,
                    })}
                  </div>
                  <div className="text-gray text-smd">
                    ~
                    {getFullDisplayBalance({
                      balance: convertedNonAutoVaultEarnings,
                      decimals: pool.earningToken.decimals,
                      displayDecimals: 5,
                    })}{' '}
                    USD
                  </div>
                </div>
                <CollectButton
                  farmMode={farmMode}
                  value={nonAutoVaultEarnings.toNumber()}
                  collectHandler={collectHandler}
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
                  {stakedValueAsString}
                </div>
                <div className="text-gray text-smd">
                  ~{convertedStakedValueAsString} {mockData.currencyToConvert}
                </div>
              </div>
              <StakeUnstakeButtons pool={pool} />
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
            stakedValue={stakedValue}
          />
        )}
      </div>
      <CardFooter farmMode={farmMode} pool={pool} />
    </div>
  );
});

export default PoolCard;
