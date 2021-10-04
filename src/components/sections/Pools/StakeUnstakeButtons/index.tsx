import React, { useMemo } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { clone } from 'mobx-state-tree';

import { Button } from '@/components/atoms';
import { useMst } from '@/store';
import { ITokenMobx } from '@/store/Models/Modals/StakeUnstakeModal';
import { convertSharesToRefinery, getStakingBalance } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
import { Pool } from '@/types';
import { BIG_ZERO } from '@/utils';

import './StakeUnstakeButtons.scss';

const StakeUnstakeButtons: React.FC<{
  className?: string;
  pool: Pool;
}> = observer(({ className, pool }) => {
  const { stakingToken, isAutoVault, userData, id: poolId } = pool;
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();

  const { modals } = useMst();

  const maxStakingValue = useMemo(() => {
    return getStakingBalance(pool);
  }, [pool]);

  const maxUnstakingValue = useMemo(() => {
    if (!userShares || !pricePerFullShare) return BIG_ZERO;
    if (isAutoVault) {
      return convertSharesToRefinery(userShares, pricePerFullShare).refineryAsBigNumber;
    }
    return userData?.stakedBalance || BIG_ZERO;
  }, [isAutoVault, pricePerFullShare, userData?.stakedBalance, userShares]);
  const clonedStakingToken = clone(stakingToken) as ITokenMobx;
  const buttons = [
    {
      handler: () => {
        modals.stakeUnstake.open({
          isStaking: false,
          maxStakingValue: maxUnstakingValue.toNumber(),
          stakingToken: clonedStakingToken,
          isAutoVault: Boolean(isAutoVault),
          poolId,
        });
      },
      text: '-',
    },
    {
      handler: () => {
        modals.stakeUnstake.open({
          isStaking: true,
          maxStakingValue: maxStakingValue.toNumber(),
          stakingToken: clonedStakingToken,
          isAutoVault: Boolean(isAutoVault),
          poolId,
        });
      },
      text: '+',
    },
  ];
  return (
    <div className={classNames(className, 'pools-stake-unstake-buttons', 'box-f')}>
      {buttons.map(({ text, handler }) => (
        <Button key={text} colorScheme="outline-purple" size="ssm" onClick={handler}>
          <span className="text-smd text-purple text-bold">{text}</span>
        </Button>
      ))}
    </div>
  );
});

export default StakeUnstakeButtons;
