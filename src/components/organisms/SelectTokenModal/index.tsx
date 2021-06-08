import React from 'react';
import nextId from 'react-id-generator';
import { Scrollbar } from 'react-scrollbars-custom';

import { Modal } from '../../molecules';
import { Search } from '../../atoms';

import './SelectTokenModal.scss';

import BnbImg from '@/assets/img/currency/bnb.svg';

interface ISelectTokenModal {
  isVisible?: boolean;
  handleClose?: () => void;
}

const SelectTokenModal: React.FC<ISelectTokenModal> = ({ isVisible, handleClose }) => {
  const tokens = new Array(10).fill({
    img: BnbImg,
    name: 'Binance',
    symbol: 'BNB',
  });
  return (
    <Modal
      isVisible={!!isVisible}
      className="m-select-token"
      handleCancel={handleClose}
      width={300}
      closeIcon
    >
      <div className="m-select-token__content">
        <div className="m-select-token__title text-purple text-bold text-smd">Select a token</div>

        <div className="m-select-token__search">
          <Search placeholder="Search" />
        </div>

        <Scrollbar
          className="m-select-token__scroll"
          style={{
            width: '100%',
            height: tokens.length > 8 ? '65vh' : `${tokens.length * 41}px`,
          }}
        >
          {tokens.map((token) => (
            <div className="m-select-token__item box-f-ai-c" key={nextId()}>
              <img src={token.img} alt="" />
              <div>
                <div>{token.name}</div>
                <div className="text-ssm text-gray-2">{token.symbol}</div>
              </div>
            </div>
          ))}
        </Scrollbar>
      </div>
    </Modal>
  );
};

export default SelectTokenModal;
