import { types } from 'mobx-state-tree';

import MetamaskErrModal from './MetamaskErrModal';
import RoiModal from './RoiModal';

const ModalsModel = types.model({
  metamaskErr: MetamaskErrModal,
  roi: RoiModal,
});

export default ModalsModel;
