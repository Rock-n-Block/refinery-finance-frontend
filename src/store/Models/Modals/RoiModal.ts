import { types, Instance } from 'mobx-state-tree';
import RoiItem from './RoiItem';

const RoiModal = types
  .model({
    items: types.optional(types.array(RoiItem), []),
  })
  .views((self) => ({
    get isOpen() {
      return Boolean(self.items.length);
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

export default RoiModal;
