import useRefresh from '@/hooks/useRefresh';
import { Farm } from '@/types';
import { useEffect } from 'react';
import { useMst } from '..';
import { farms as farmsConfig } from '@/config/farms';
import BigNumber from 'bignumber.js/bignumber';
import { BIG_ZERO } from '@/utils';

export const useFarms = (): { farms: Farm[] } => {
  const { farms } = useMst();

  return { farms: farms.data.slice() as Farm[] };
};

export const usePollFarmsData = () => {
  const { slowRefresh } = useRefresh();
  const { user, farms: farmsStore } = useMst();

  useEffect(() => {
    // const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid);

    farmsStore.fetchFarmsPublicDataAsync(pids);

    if (user.address) {
      farmsStore.fetchFarmUserDataAsync(user.address, pids);
    }
  }, [farmsStore, user.address, slowRefresh]);
};

export const useFarmUserData = (farm: Farm) => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
};
