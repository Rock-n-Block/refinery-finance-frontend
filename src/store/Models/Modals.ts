import { types, Instance } from 'mobx-state-tree';

const MetamaskErrModal = types
  .model({
    errMsg: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setErr(err: string) {
      self.errMsg = err;
    },
    close() {
      self.errMsg = '';
    },
  }));

const RoiItem = types.model({
  timeframe: types.string,
  roi: types.union(types.number, types.string),
  rf: types.union(types.number, types.string),
});

const RoiModal = types
  .model({
    items: types.optional(types.array(RoiItem), []),
  })
  .views((self) => ({
    get isOpen() {
      return !!self.items.length;
    },
  }))
  .actions((self) => ({
    close() {
      self.items.clear();
    },
    open(items: Instance<typeof RoiItem>[]) {
      self.items.push(...items);
    },
  }));

const ModalsModel = types.model({
  metamaskErr: MetamaskErrModal,
  roi: RoiModal,
});

export default ModalsModel;
