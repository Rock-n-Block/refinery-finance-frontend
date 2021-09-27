import useRefresh from '@/hooks/useRefresh';
import { Farm } from '@/types';
import { useEffect } from 'react';
import { useMst } from '..';
import { farms as farmsConfig } from '@/config/farms';

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
