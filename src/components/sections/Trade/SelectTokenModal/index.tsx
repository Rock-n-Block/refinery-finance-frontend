import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { observer } from 'mobx-react-lite';

import { Modal } from '../../../molecules';
import { Search } from '../../../atoms';
import { IToken } from '../../../../types';
import { useMst } from '../../../../store';
import { ManageTokensModal } from '..';

import './SelectTokenModal.scss';

import UnknownImg from '@/assets/img/currency/unknown.svg';

interface ISelectTokenModal {
  isVisible?: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  handleChangeToken: (type: 'from' | 'to', token: IToken) => void;
  tokenType: 'from' | 'to';
  isManageTokens?: boolean;
}

const SelectTokenModal: React.FC<ISelectTokenModal> = observer(
  ({ isVisible, handleClose, handleChangeToken, tokenType, isManageTokens, handleOpen }) => {
    const { tokens: storeTokens } = useMst();

    const [isManageModalVisible, setManageModalVisible] = React.useState<boolean>(false);

    const [tokens, setTokens] = React.useState<IToken[] | []>([]);
    const [initTokens, setInitTokens] = React.useState<IToken[] | []>([]);

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

    const handleCloseManageModal = (): void => {
      setManageModalVisible(false);
    };

    const handleOpenManageModal = (): void => {
      setTokens(initTokens);
      handleClose();
      setManageModalVisible(true);
    };

    const handleBackToSelectTokenModal = (): void => {
      handleCloseManageModal();
      handleOpen();
    };

    const handleChangeSwitch = (extendedValue: boolean, topValue: boolean): void => {
      if (extendedValue && topValue) {
        setInitTokens([...storeTokens.extended, ...storeTokens.top]);

        setTokens([...storeTokens.extended, ...storeTokens.top]);
        return;
      }
      if (extendedValue) {
        setInitTokens(storeTokens.extended);

        setTokens(storeTokens.extended);
        return;
      }
      if (topValue) {
        setInitTokens([...storeTokens.default, ...storeTokens.top]);

        setTokens([...storeTokens.default, ...storeTokens.top]);
        return;
      }

      setInitTokens(storeTokens.default);

      setTokens(storeTokens.default);
    };

    React.useEffect(() => {
      setInitTokens(storeTokens.default);
      setTokens(storeTokens.default);
    }, [storeTokens.default]);

    return (
      <>
        <Modal
          isVisible={!!isVisible}
          className="m-select-token"
          handleCancel={handleClose}
          width={300}
          destroyOnClose
          closeIcon
        >
          <div className="m-select-token__content">
            <div className="m-select-token__title text-purple text-bold text-smd">
              Select a token
            </div>

            <div className="m-select-token__search">
              <Search placeholder="Search" realtime onChange={handleSearch} />
            </div>

            <Scrollbar
              className="m-select-token__scroll"
              style={{
                width: '100%',
                height: tokens.length > 8 ? '55vh' : `${tokens.length * 60}px`,
              }}
            >
              {[...tokens, ...storeTokens.imported].map((token: IToken) => (
                <div
                  className="m-select-token__item box-f-ai-c"
                  key={token.name}
                  onClick={() => handleTokenClick(token)}
                  onKeyDown={() => handleTokenClick(token)}
                  role="button"
                  tabIndex={-2}
                >
                  <img
                    onError={(e: any) => {
                      e.target.src = UnknownImg;
                    }}
                    src={token.logoURI}
                    alt=""
                  />
                  <div>
                    <div>{token.name}</div>
                    <div className="text-ssm text-gray-2">{token.symbol}</div>
                  </div>
                </div>
              ))}
            </Scrollbar>
            {isManageTokens ? (
              <div
                className="m-select-token__manage text-purple text-med text-center box-pointer"
                onClick={handleOpenManageModal}
                onKeyDown={handleOpenManageModal}
                role="button"
                tabIndex={0}
              >
                Manage Tokens
              </div>
            ) : (
              ''
            )}
          </div>
        </Modal>
        {isManageTokens ? (
          <ManageTokensModal
            isVisible={isManageModalVisible}
            handleClose={handleCloseManageModal}
            handleBack={handleBackToSelectTokenModal}
            handleOpen={handleOpenManageModal}
            handleChangeSwitch={handleChangeSwitch}
            selectToken={handleTokenClick}
          />
        ) : (
          ''
        )}
      </>
    );
  },
);

export default SelectTokenModal;
