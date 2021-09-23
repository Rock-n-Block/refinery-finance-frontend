import React, { useMemo } from 'react';
// import { getBalanceAmount } from '@/utils/formatBalance';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import { useMst } from '@/store';
import { convertSharesToRefinery } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
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
import { getAprData } from './utils';

import './PoolCard.scss';

export interface IPoolCard {
  className?: string;
  // tokenEarn?: IToken;
  // tokenStake: IToken;
  farmMode: IPoolFarmingMode;
  pool: Pool;
}

const PoolCard: React.FC<IPoolCard> = observer(({ className, farmMode, pool }) => {
  const {
    modals,
    user,
    pools: {
      fees: { performanceFee },
    },
  } = useMst();
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();
  const { earningToken, stakingToken, userData, apr, earningTokenPrice } = pool;

  // const refineryPriceUsd = new BigNumber(37); // TODO: retrieving this value not hardcoded

  const handleOpenApr = (): void => {
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

  const nonAutoVaultEarnings = useMemo(() => {
    return userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO;
  }, [userData?.pendingReward]);
  const nonAutoVaultEarningsAsString = useMemo(() => nonAutoVaultEarnings.toString(), [
    nonAutoVaultEarnings,
  ]);

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
    // MOCK_setRecentProfit(0);
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

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     MOCK_setNonAutoVaultEarnings(0.0003);
  //   }, 2000);
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (MOCK_timeLeft === 0) clearInterval(intervalId);
  //     MOCK_setTimeLeft(MOCK_timeLeft - 60 * 1000);
  //   }, 1000);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [MOCK_timeLeft]);

  const USD_IN_TOKEN = 27;

  const convertedStakedValue = useMemo(() => {
    return new BigNumber(stakedValueAsString).times(USD_IN_TOKEN);
  }, [stakedValueAsString]);
  const convertedStakedValueAsString = useMemo(() => convertedStakedValue.toString(), [
    convertedStakedValue,
  ]);

  const convertedNonAutoVaultEarnings = useMemo(() => {
    return nonAutoVaultEarnings.times(USD_IN_TOKEN);
  }, [nonAutoVaultEarnings]);

  const convertedNonAutoVaultEarningsAsString = useMemo(
    () => convertedNonAutoVaultEarnings.toString(),
    [convertedNonAutoVaultEarnings],
  );

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
        <AutoVaultRecentProfitSection
          autoFarmMode={farmMode === PoolFarmingMode.auto}
          hasStakedValue={Boolean(hasStakedValue)}
          stakingTokenSymbol={stakingToken.symbol}
        />
        {hasConnectedWallet &&
          (farmMode === PoolFarmingMode.earn || farmMode === PoolFarmingMode.manual) && (
            <>
              <div className="p-card__earned box-f box-f-jc-sb">
                <div>
                  <div className="text-smd text-purple text-med">{earningToken.symbol} Earned</div>
                  <div className="p-card__earned-profit-value text-blue-d text-smd">
                    {nonAutoVaultEarningsAsString}
                  </div>
                  <div className="text-gray text-smd">
                    ~{convertedNonAutoVaultEarningsAsString} USD
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
                <div className="text-gray text-smd">~{convertedStakedValueAsString} USD</div>
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
      <CardFooter farmMode={farmMode} pool={pool} />
    </div>
  );
});

export default PoolCard;
