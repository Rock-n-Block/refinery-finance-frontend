import React from 'react';
import { RadioChangeEvent } from 'antd';
import cn from 'classnames';
import { Scrollbar } from 'react-scrollbars-custom';

import { Modal } from '../../../molecules';
import { RadioGroup, Input, Switch, Button } from '../../../atoms';
import { IToken } from '../../../../types';
import { ImportTokensModal } from '..';

import './ManageTokensModal.scss';

import ArrowImg from '@/assets/img/icons/arrow-btn.svg';
import LogoMiniImg from '@/assets/img/icons/logo-m.svg';
import UnknownImg from '@/assets/img/currency/unknown.svg';

interface IManageTokensModal {
  isVisible?: boolean;
  handleClose: () => void;
  handleBack: () => void;
  handleOpen: () => void;
}

const ManageTokensModal: React.FC<IManageTokensModal> = ({
  isVisible,
  handleClose,
  handleOpen,
  handleBack,
}) => {
  const [acitveTab, setActiveTab] = React.useState<'lists' | 'tokens'>('lists');
  const [isExtendedTokensActive, setExtendedTokensActive] = React.useState<boolean>(false);
  const [isTopTokensActive, setTopTokensActive] = React.useState<boolean>(false);
  const [unknownTokens, setUnknowTokens] = React.useState<IToken[] | []>([]);
  const [selectedToken, setSelectedToken] = React.useState<IToken | undefined>();

  const handleChangeNavbar = ({ target }: RadioChangeEvent): void => {
    setActiveTab(target.value);
  };

  const handleChangeExtendedTokensSwitch = (value: boolean): void => {
    setExtendedTokensActive(value);
  };

  const handleChangeTopTokensSwitch = (value: boolean): void => {
    setTopTokensActive(value);
  };

  const handleOpenImportTokensModal = (token: IToken): void => {
    handleClose();
    setSelectedToken(token);
  };

  const handleCloseImportTokensModal = (): void => {
    setSelectedToken(undefined);
  };

  const handleBackToManageTokensModal = (): void => {
    handleCloseImportTokensModal();
    handleOpen();
  };

  const handleChangeTokensInput = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(target.value);
    if (target.value) {
      setUnknowTokens([
        {
          img: UnknownImg,
          name: 'NameToken',
          symbol: 'NTK1',
        },
        {
          img: UnknownImg,
          name: 'NameToken',
          symbol: 'NTK2',
        },
        {
          img: UnknownImg,
          name: 'NameToken',
          symbol: 'NTK3',
        },
        {
          img: UnknownImg,
          name: 'NameToken',
          symbol: 'NTK4',
        },
        {
          img: UnknownImg,
          name: 'NameToken',
          symbol: 'NTK5',
        },
      ]);
    } else {
      setUnknowTokens([]);
    }
  };

  return (
    <>
      <Modal
        isVisible={!!isVisible}
        className="m-manage-tokens"
        handleCancel={handleClose}
        width={390}
        closeIcon
      >
        <div className="m-manage-tokens__content">
          <div
            className="m-manage-tokens__title box-f-ai-c box-pointer"
            onClick={handleBack}
            onKeyDown={handleBack}
            role="button"
            tabIndex={0}
          >
            <img src={ArrowImg} alt="" />
            <span className="text-purple text-bold text-smd">Manage</span>
          </div>
          <RadioGroup
            className="m-manage-tokens__radio"
            onChange={handleChangeNavbar}
            buttonStyle="solid"
            defaultValue={acitveTab}
            items={[
              {
                text: 'Lists',
                value: 'lists',
              },
              {
                text: 'Tokens',
                value: 'tokens',
              },
            ]}
          />
          {acitveTab === 'lists' ? (
            <>
              <Input
                className="m-manage-tokens__input"
                placeholder="http:// or ipfs:// or ENS name"
                colorScheme="outline"
                inputSize="lg"
              />
              <div
                className={cn('m-manage-tokens__item box-f-ai-c box-f-jc-sb', {
                  active: isExtendedTokensActive,
                })}
              >
                <div className="box-f-ai-c">
                  <img
                    src={LogoMiniImg}
                    alt="refinery finance"
                    className="m-manage-tokens__item-logo"
                  />
                  <div>
                    <div className="text-med text-purple m-manage-tokens__item-title text">
                      Refinery.Finance Extended
                    </div>
                    <div className="text-med text-gray text-ssm text">195 tokens</div>
                  </div>
                </div>
                <Switch
                  colorScheme="white-purple"
                  switchSize="bg"
                  defaultChecked={isExtendedTokensActive}
                  onChange={handleChangeExtendedTokensSwitch}
                />
              </div>
              <div
                className={cn('m-manage-tokens__item box-f-ai-c box-f-jc-sb', {
                  active: isTopTokensActive,
                })}
              >
                <div className="box-f-ai-c">
                  <img
                    src={LogoMiniImg}
                    alt="refinery finance"
                    className="m-manage-tokens__item-logo"
                  />
                  <div>
                    <div className="text-med text-purple m-manage-tokens__item-title text">
                      Refinery.Finance Top 100
                    </div>
                    <div className="text-med text-gray text-ssm text">195 tokens</div>
                  </div>
                </div>
                <Switch
                  colorScheme="white-purple"
                  switchSize="bg"
                  defaultChecked={isTopTokensActive}
                  onChange={handleChangeTopTokensSwitch}
                />
              </div>{' '}
            </>
          ) : (
            ''
          )}
          {acitveTab === 'tokens' ? (
            <>
              <Input
                className="m-manage-tokens__input"
                placeholder="0x00"
                colorScheme="outline"
                inputSize="lg"
                onChange={handleChangeTokensInput}
              />
              {unknownTokens.length ? (
                <Scrollbar
                  className="m-manage-tokens__scroll"
                  style={{
                    width: '100%',
                    height: unknownTokens.length > 8 ? '50vh' : `${unknownTokens.length * 60}px`,
                  }}
                >
                  {unknownTokens.map((token: IToken) => (
                    <div
                      key={token.symbol}
                      className="m-manage-tokens__token box-f-ai-c box-f-jc-sb"
                    >
                      <div className="box-f-ai-c">
                        <img
                          src={token.img}
                          alt={token.name}
                          className="m-manage-tokens__token-img"
                        />
                        <div>
                          <div className="text m-manage-tokens__token-name">{token.name}</div>
                          <div className="text-gray text-ssm">{token.symbol}</div>
                        </div>
                      </div>
                      <Button size="smd" onClick={() => handleOpenImportTokensModal(token)}>
                        <span className="text-bold text-white text-smd">Import</span>
                      </Button>
                    </div>
                  ))}
                </Scrollbar>
              ) : (
                ''
              )}
              <div className="text-med text text-purple m-manage-tokens__text">
                {unknownTokens.length} Custom Tokens
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </Modal>
      <ImportTokensModal
        isVisible={!!selectedToken}
        handleClose={handleCloseImportTokensModal}
        handleBack={handleBackToManageTokensModal}
        token={selectedToken}
      />
    </>
  );
};

export default ManageTokensModal;
