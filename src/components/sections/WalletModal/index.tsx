import React from 'react';
import { observer } from 'mobx-react-lite';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Modal } from '../../molecules';
import { Button } from '../../atoms';
import { useMst } from '../../../store';
import { useWalletConnectorContext } from '../../../services/MetamaskConnect';

import './WalletModal.scss';

import CopyImg from '../../../assets/img/icons/copy.svg';
import LogoutImg from '../../../assets/img/icons/logout.svg';

interface IImportTokensModal {
  isVisible?: boolean;
  handleClose: () => void;
}

const WalletModal: React.FC<IImportTokensModal> = observer(({ isVisible, handleClose }) => {
  const { user } = useMst();
  const { disconnect } = useWalletConnectorContext();

  const handleLogout = () => {
    handleClose();
    disconnect();
  };

  return (
    <Modal
      isVisible={!!isVisible}
      className="m-wallet"
      handleCancel={handleClose}
      width={390}
      closeIcon
    >
      <div className="m-wallet__content">
        <div className="text-smd text-bold text-purple m-wallet__title">Your wallet</div>
        <div className="m-wallet__address text-purple text-md">{user.address}</div>
        <div className="m-wallet__box">
          <a
            href={`https://kovan.etherscan.io/address/${user.address}`}
            rel="noreferrer"
            target="_blank"
            className="m-wallet__item box-f-ai-c"
          >
            <img src={CopyImg} alt="" />
            <span className="text text-black">View on BscScan</span>
          </a>
          <CopyToClipboard text={user.address}>
            <div className="m-wallet__item box-f-ai-c box-pointer">
              <img src={CopyImg} alt="" />
              <span className="text text-black">Copy Address</span>
            </div>
          </CopyToClipboard>
        </div>
        <Button
          className="m-wallet__btn"
          colorScheme="outline-purple"
          size="ssm"
          icon={LogoutImg}
          onClick={handleLogout}
        >
          <span>Logout</span>
        </Button>
      </div>
    </Modal>
  );
});

export default WalletModal;