import { types, Instance } from 'mobx-state-tree';
import RoiOptionsModel from './RoiOptions';

const RoiModal = types
  .model({
    options: types.maybeNull(RoiOptionsModel),
  })
  .views((self) => ({
    get isOpen() {
      return Boolean(self.options);
      // return Boolean(self.options.length);
    },
  }))
  .actions((self) => ({
    close() {
      self.options = null;
      // self.options.clear();
    },
    open(options: Instance<typeof RoiOptionsModel>) {
      self.options = options;
      // self.options.push(options);
    },
  }));

export default RoiModal;
