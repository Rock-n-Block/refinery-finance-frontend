import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

import { Modal } from '../../../molecules';
import { Search } from '../../../atoms';
import { IToken } from '../Swap';

import './SelectTokenModal.scss';

import BnbImg from '@/assets/img/currency/bnb.svg';

interface ISelectTokenModal {
  isVisible?: boolean;
  handleClose: () => void;
  handleChangeToken: (type: 'from' | 'to', token: IToken) => void;
  tokenType: 'from' | 'to';
}

const SelectTokenModal: React.FC<ISelectTokenModal> = ({
  isVisible,
  handleClose,
  handleChangeToken,
  tokenType,
}) => {
  const initTokens = [
    {
      img: BnbImg,
      name: 'Binance',
      symbol: 'BNB',
    },
    {
      img: BnbImg,
      name: 'Ethereum',
      symbol: 'ETH',
    },
  ];

  const [tokens, setTokens] = React.useState(initTokens);

  const handleSearch = (value: number | string): void => {
    if (value === '') {
      setTokens(initTokens);
      return;
    }
    setTokens(
      initTokens.filter((token) => {
        if (typeof value === 'string') {
          return (
            token.name.substr(0, value.length).toLowerCase() === value.toLowerCase() ||
            token.symbol.substr(0, value.length).toLowerCase() === value.toLowerCase()
          );
        }
        return false;
      }),
    );
  };

  const handleTokenClick = (token: IToken) => {
    handleChangeToken(tokenType, token);
    handleClose();
  };

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
          <Search placeholder="Search" realtime onChange={handleSearch} />
        </div>

        <Scrollbar
          className="m-select-token__scroll"
          style={{
            width: '100%',
            height: tokens.length > 8 ? '65vh' : `${tokens.length * 60}px`,
          }}
        >
          {tokens.map((token) => (
            <div
              className="m-select-token__item box-f-ai-c"
              key={token.symbol}
              onClick={() => handleTokenClick(token)}
              onKeyDown={() => handleTokenClick(token)}
              role="button"
              tabIndex={-2}
            >
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
