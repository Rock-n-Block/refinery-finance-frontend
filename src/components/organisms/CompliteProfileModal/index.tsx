/* eslint-disable react/react-in-jsx-scope */
import { FC } from 'react';

import ArrowImg from '@/assets/img/sections/profile/blue-arrow.svg';
import { Button } from '@/components/atoms/index';
import { Modal } from '@/components/molecules';

import './CompliteProfileModal.scss';

interface ICompliteProfileModal {
  isVisible: boolean;
  isCompliteApprove: boolean;
  handleClose: () => void;
  handleChangeApprove: () => void;
}

const CompliteProfileModal: FC<ICompliteProfileModal> = ({
  isVisible,
  handleClose,
  isCompliteApprove,
  handleChangeApprove,
}) => {
  const handleApprove = () => {
    handleChangeApprove();
  };
  return (
    <Modal
      isVisible={isVisible}
      width={390}
      closeIcon
      handleCancel={handleClose}
      className="create-profile-modal"
    >
      <div className="create-profile-modal__body">
        <div className="create-profile-modal__body__title">Complite Profile</div>
        <div className="create-profile-modal__body__text">
          Submitting NFT to contract and confirming User Name and Team.
        </div>
        <div className="create-profile-modal__body__controls">
          <Button
            colorScheme="purple"
            size="md"
            className="create-profile-modal__body__controls-btn"
            onClick={handleApprove}
            disabled={isCompliteApprove}
          >
            Enable
          </Button>
          <img src={ArrowImg} alt="arrowImg" />
          <Button
            colorScheme="purple"
            size="md"
            className="create-profile-modal__body__controls-btn"
            disabled={!isCompliteApprove}
            link="/profile"
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CompliteProfileModal;
