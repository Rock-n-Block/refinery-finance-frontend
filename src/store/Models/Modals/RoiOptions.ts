import { types } from 'mobx-state-tree';

const RoiOptionsModel = types.model({
  isFarmPage: types.boolean,
  apr: types.number,
  tokenPrice: types.number,
});

export default RoiOptionsModel;
