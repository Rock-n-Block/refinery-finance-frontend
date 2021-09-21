import { types } from 'mobx-state-tree';

const StakeUnstakeModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
    isStaking: types.optional(types.boolean, true),
    stakedValue: types.optional(types.number, 0), // TODO: move value of each Pool into an Array<IPool> -> IPool: { stakedValue: 0.34 } etc.
  })
  .views((self) => ({
    get result() {
      return self.stakedValue;
    },
  }))
  .actions((self) => ({
    stake(value: number) {
      self.stakedValue += value;
    },
    unstake(value: number) {
      self.stakedValue -= value;
    },
    close() {
      self.isOpen = false;
    },
    open({ isStaking, stakedValue }: { isStaking: boolean; stakedValue: number }) {
      self.isOpen = true;
      self.isStaking = isStaking;
      self.stakedValue = stakedValue;
    },
  }));

export default StakeUnstakeModal;
