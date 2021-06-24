import React from 'react';

import { InputNumber, Button } from '../../../atoms';
import { SelectTokenModal } from '..';
import { ITokens, IToken } from '../../../../types';

import './ChooseTokens.scss';

import ArrowImg from '@/assets/img/icons/arrow-cur.svg';

export interface IChooseTokens {
  handleChangeTokens: (tokens: ITokens) => void;
  initialTokenData?: ITokens;
  isManageTokens?: boolean;
  textFrom?: string;
  textTo?: string;
}

const ChooseTokens: React.FC<IChooseTokens> = React.memo(
  ({ handleChangeTokens, initialTokenData, isManageTokens, textFrom, textTo }) => {
    const [tokenFrom, setTokenFrom] = React.useState<IToken | undefined>(
      initialTokenData ? initialTokenData.from.token : undefined,
    );
    const [tokenFromQuantity, setTokenFromQuantity] = React.useState<number>(
      initialTokenData ? initialTokenData.from.amount : NaN,
    );

    const [tokenTo, setTokenTo] = React.useState<IToken | undefined>(
      initialTokenData ? initialTokenData.to.token : undefined,
    );
    const [tokenToQuantity, setTokenToQuantity] = React.useState<number>(
      initialTokenData ? initialTokenData.to.amount : NaN,
    );

    const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
    const [tokenType, setTokenType] = React.useState<'from' | 'to'>('from');

    const handleCloseSelectTokenModal = (): void => {
      setModalVisible(false);
    };

    const handleOpenSelectTokenModal = (type: 'from' | 'to'): void => {
      setModalVisible(true);
      setTokenType(type);
    };

    const handleChangeTokenFrom = async (token: IToken | undefined) => {
      if (token) {
        if (tokenTo && token.symbol === tokenTo.symbol) {
          setTokenTo(tokenFrom);
          setTokenToQuantity(tokenFromQuantity);
          setTokenFromQuantity(tokenToQuantity);
        }
        setTokenFrom(token);

        handleChangeTokens({
          from: {
            token,
            amount: tokenFromQuantity,
          },
          to: {
            token: tokenFrom,
            amount: tokenToQuantity,
          },
        });
      }
    };

    const handleChangeTokenTo = (token: IToken | undefined): void => {
      if (token) {
        if (tokenFrom && token.symbol === tokenFrom.symbol) {
          setTokenFrom(tokenTo);
          setTokenFromQuantity(tokenToQuantity);
          setTokenToQuantity(tokenFromQuantity);
        }
        setTokenTo(token);

        handleChangeTokens({
          from: {
            token: tokenFrom,
            amount: tokenFromQuantity,
          },
          to: {
            token,
            amount: tokenToQuantity,
          },
        });
      }
    };

    const handleChangeToken = (type: 'from' | 'to', token: IToken | undefined) => {
      if (type === 'from') {
        handleChangeTokenFrom(token);
      }
      if (type === 'to') {
        handleChangeTokenTo(token);
      }
    };

    const handleChangeTokensQuantity = (type: 'from' | 'to', quantity: number) => {
      if (type === 'from') {
        setTokenFromQuantity(quantity);

        handleChangeTokens({
          from: {
            token: tokenFrom,
            amount: quantity,
          },
          to: {
            token: tokenTo,
            amount: tokenToQuantity,
          },
        });
      }
      if (type === 'to') {
        setTokenToQuantity(quantity);

        handleChangeTokens({
          from: {
            token: tokenFrom,
            amount: tokenFromQuantity,
          },
          to: {
            token: tokenTo,
            amount: quantity,
          },
        });
      }
    };
    return (
      <>
        <div className="choose-tokens">
          {tokenFrom ? (
            <>
              <div className="box-f-jc-sb box-f choose-tokens__box-title">
                <div className="text-upper text-purple text-med">{tokenFrom.symbol}</div>
                <div className="text-sm text-gray text-med">{textFrom || 'From'}</div>
              </div>
              <div className="box-f box-f-jc-sb">
                <div
                  className="choose-tokens__currency box-f-ai-c"
                  onClick={() => handleOpenSelectTokenModal('from')}
                  onKeyDown={() => handleOpenSelectTokenModal('from')}
                  tabIndex={0}
                  role="button"
                >
                  <img src={tokenFrom.logoURI} alt="" className="choose-tokens__currency-img" />
                  <img src={ArrowImg} alt="" className="choose-tokens__currency-arrow" />
                </div>
                <InputNumber
                  value={tokenFromQuantity}
                  placeholder="0"
                  onChange={(value: number | string) => handleChangeTokensQuantity('from', +value)}
                />
              </div>
            </>
          ) : (
            <Button
              className="choose-tokens__select"
              onClick={() => handleOpenSelectTokenModal('from')}
              colorScheme="gray"
              size="lmd"
            >
              <span className="text-center text-purple text-med">Select a Token</span>
            </Button>
          )}
          <div className="choose-tokens__line box-f-ai-c">
            <div
              className="box-circle"
              onClick={() => handleChangeToken('from', tokenTo)}
              onKeyDown={() => handleChangeToken('from', tokenTo)}
              role="button"
              tabIndex={0}
            >
              {' '}
            </div>
          </div>
          {tokenTo ? (
            <>
              <div className="box-f-jc-sb box-f choose-tokens__box-title">
                <div className="text-upper text-purple text-med">{tokenTo.symbol}</div>
                <div className="text-sm text-gray text-med">{textTo || 'To'}</div>
              </div>
              <div className="box-f box-f-jc-sb">
                <div
                  className="choose-tokens__currency box-f-ai-c"
                  onClick={() => handleOpenSelectTokenModal('to')}
                  onKeyDown={() => handleOpenSelectTokenModal('to')}
                  tabIndex={0}
                  role="button"
                >
                  <img src={tokenTo.logoURI} alt="" className="choose-tokens__currency-img" />
                  <img src={ArrowImg} alt="" className="choose-tokens__currency-arrow" />
                </div>
                <InputNumber
                  value={tokenToQuantity}
                  placeholder="0"
                  onChange={(value: number | string) => handleChangeTokensQuantity('to', +value)}
                />
              </div>{' '}
            </>
          ) : (
            <Button
              className="choose-tokens__select"
              onClick={() => handleOpenSelectTokenModal('to')}
              colorScheme="gray"
              size="lmd"
            >
              <span className="text-center text-purple text-med">Select a Token</span>
            </Button>
          )}
        </div>
        <SelectTokenModal
          isVisible={isModalVisible}
          handleClose={handleCloseSelectTokenModal}
          handleOpen={() => handleOpenSelectTokenModal(tokenType)}
          handleChangeToken={handleChangeToken}
          tokenType={tokenType}
          isManageTokens={isManageTokens}
        />
      </>
    );
  },
);

export default ChooseTokens;
