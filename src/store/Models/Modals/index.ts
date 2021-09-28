import { types } from 'mobx-state-tree';

import MetamaskErrModal from './MetamaskErrModal';
import RoiModal from './RoiModal';
import StakeUnstakeModal from './StakeUnstakeModal';
import PoolsCollectModal from './PoolsCollectModal';
import FarmsStakeUnstakeModal from './FarmsStakeUnstakeModal';

const ModalsModel = types.model({
  metamaskErr: MetamaskErrModal,
  roi: RoiModal,
  stakeUnstake: StakeUnstakeModal,
  poolsCollect: PoolsCollectModal,
  farmsStakeUnstake: FarmsStakeUnstakeModal,
});

export default ModalsModel;
