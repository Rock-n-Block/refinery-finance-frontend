import React, { useMemo } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useMst } from '@/store';
import { useStakedValue } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode, Precisions } from '@/types';

import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import AutoVaultRecentProfitSection from './AutoVaultRecentProfitSection';
import CardFooter from './CardFooter';
import CardSubtitle from './CardSubtitle';
import CardTitle from './CardTitle';
import EarnedSection from './EarnedSection';

import { toBigNumber, getFullDisplayBalance } from '@/utils';
import { useAprModal } from '@/hooks/pools/useAprModal';
import { mockData } from './utils';

import 'antd/lib/select/style/css';
import './PoolCard.scss';

export interface IPoolCard {
  className?: string;
  farmMode: IPoolFarmingMode;
  pool: Pool;
}

const PoolCard: React.FC<IPoolCard> = observer(({ className, farmMode, pool }) => {
  const { user } = useMst();
  const hasConnectedWallet = Boolean(user.address);
  const { earningToken, stakingToken, isFinished } = pool;
  const { tokenUsdPrice: refineryUsdPrice } = useRefineryUsdPrice();

  const { hasStakedValue, stakedValue } = useStakedValue(farmMode, pool);

  const stakedValueAsString = useMemo(
    () =>
      getFullDisplayBalance({
        balance: stakedValue,
        decimals: stakingToken.decimals,
        displayDecimals: Precisions.shortToken,
      }).toString(),
    [stakedValue, stakingToken.decimals],
  );
  const convertedStakedValue = useMemo(() => {
    return toBigNumber(stakedValueAsString).times(refineryUsdPrice).toFixed(Precisions.fiat);
  }, [stakedValueAsString, refineryUsdPrice]);

  const { earningsPercentageToDisplay, handleOpenAprModal } = useAprModal(farmMode, pool);

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
        {isFinished && (
          <div className="p-card__badge_finished box-purple-l text-orange text-bold">Finished</div>
        )}
      </div>
      <div className="p-card__apr p-card__box box-f-ai-c box-f-jc-sb">
        <span className="text-smd text-purple text-med text-upper">
          {farmMode === PoolFarmingMode.auto ? 'apy' : 'apr'}
        </span>
        <div
          className="p-card__apr-percent box-pointer"
          onClick={handleOpenAprModal}
          onKeyDown={handleOpenAprModal}
          role="button"
          tabIndex={0}
        >
          <span className="text-smd">{earningsPercentageToDisplay}%</span>
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
        {farmMode !== PoolFarmingMode.auto && <EarnedSection pool={pool} farmMode={farmMode} />}
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
                  ~{convertedStakedValue} {mockData.currencyToConvert}
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
