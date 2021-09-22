import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '@/store';
import { getRefineryVaultEarnings } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
import { BIG_ZERO } from '@/utils';

import TextUnstakingFee from '../TextUnstakingFee';

import UnstakingFeeTimer from './UnstakingFeeTimer';

interface IAutoVaultRecentProfitSectionProps {
  autoFarmMode: boolean;
  hasStakedValue: boolean;
  stakingTokenSymbol: string;
}

const AutoVaultRecentProfitSection: React.FC<IAutoVaultRecentProfitSectionProps> = observer(
  ({ autoFarmMode, hasStakedValue, stakingTokenSymbol }) => {
    const { user } = useMst();

    const {
      pricePerFullShare,
      userData: { userShares, refineryAtLastUserAction },
    } = useSelectVaultData();

    const {
      // hasAutoEarnings,
      autoRefineryToDisplay: autoRefineryVaultRecentProfit,
    } = getRefineryVaultEarnings(
      user.address,
      refineryAtLastUserAction || BIG_ZERO,
      userShares || BIG_ZERO,
      pricePerFullShare || BIG_ZERO,
    );

    if (user.address && autoFarmMode && !hasStakedValue) {
      return (
        <div className="p-card__auto">
          <div className="p-card__auto-title text-purple text-smd text-med">
            Recent {stakingTokenSymbol} profit:
          </div>
          <TextUnstakingFee className="p-card__auto-profit" />
        </div>
      );
    }

    if (user.address && autoFarmMode && hasStakedValue) {
      return (
        <div className="p-card__auto">
          <div className="p-card__auto-title box-f box-f-jc-sb text-purple text-smd text-med">
            <div className="">Recent {stakingTokenSymbol} profit:</div>
            <div>{autoRefineryVaultRecentProfit}</div>
          </div>

          <div className="p-card__auto-profit box-f box-f-jc-sb">
            <TextUnstakingFee className="p-card__auto-info" />
            <UnstakingFeeTimer />
          </div>
        </div>
      );
    }

    return null;
  },
);

export default AutoVaultRecentProfitSection;
