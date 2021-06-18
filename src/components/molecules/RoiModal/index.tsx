import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../../store';
import { Modal } from '..';

import './RoiModal.scss';

const RoiModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = () => {
    modals.roi.close();
  };
  return (
    <Modal isVisible={modals.roi.isOpen} className="m-roi" handleCancel={handleClose}>
      <div className="m-roi__content">
        <div className="m-roi__title text-md text-med text-purple text-upper">roi</div>
      </div>
    </Modal>
  );
});

export default RoiModal;
