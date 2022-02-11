import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observer } from 'mobx-react-lite';

import CopyImg from '../../../assets/img/icons/copy.svg';
import LogoutImg from '../../../assets/img/icons/logout.svg';
import { useWalletConnectorContext } from '../../../services/MetamaskConnect';
import { useMst } from '../../../store';
import { Button } from '../../atoms';
import { Modal } from '../../molecules';

import './WalletModal.scss';

interface IImportTokensModal {
  isVisible?: boolean;
  handleClose: () => void;
}

const WalletModal: React.FC<IImportTokensModal> = observer(({ isVisible, handleClose }) => {
  const { user } = useMst();
  const { disconnect } = useWalletConnectorContext();
  const [copyBtnText, setCopyBtnText] = useState('Copy Address');

  const handleLogout = () => {
    handleClose();
    disconnect();
  };

  const handleCopying = () => {
    setCopyBtnText('Copied!');
    setTimeout(() => {
      setCopyBtnText('Copy Address');
    }, 3000);
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
            <span className="text text-black">View on Etherscan</span>
          </a>
          <CopyToClipboard text={user.address} onCopy={handleCopying}>
            <div className="m-wallet__item box-f-ai-c box-pointer">
              <img src={CopyImg} alt="" />
              <span className="text text-black">{copyBtnText}</span>
            </div>
          </CopyToClipboard>
        </div>
        <div className="m-wallet-profile box-f-c">
          {/* <Button className="m-wallet-profile__btn" link="/create-profile" onClick={handleClose}>
            Make a Profile
          </Button> */}
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
