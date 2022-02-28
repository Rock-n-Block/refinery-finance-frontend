import { types } from 'mobx-state-tree';

const RoiOptionsModel = types.model({
  isFarmPage: types.boolean,
  apr: types.number,
  // tokenPrice: types.number,
  earningTokenPrice: types.string,
  earningTokenSymbol: types.string,

  stakingTokenBalance: types.string,
  stakingTokenPrice: types.string,
  stakingTokenSymbol: types.string,

  autoCompoundFrequency: types.number,
  performanceFee: types.number,
});

export default RoiOptionsModel;
