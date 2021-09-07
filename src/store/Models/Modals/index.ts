import { types } from 'mobx-state-tree';

import MetamaskErrModal from './MetamaskErrModal';
import RoiModal from './RoiModal';
import StakeUnstakeModal from './StakeUnstakeModal';

const ModalsModel = types.model({
  metamaskErr: MetamaskErrModal,
  roi: RoiModal,
  stakeUnstake: StakeUnstakeModal,
});

export default ModalsModel;
