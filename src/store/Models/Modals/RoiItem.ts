import { types } from 'mobx-state-tree';

const RoiItem = types.model({
  timeframe: types.string,
  roi: types.union(types.number, types.string),
  rf: types.union(types.number, types.string),
});

export default RoiItem;
