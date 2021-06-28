import React from 'react';

import { InputNumber, Button } from '../../../atoms';
import { SelectTokenModal } from '..';
import { ITokens, IToken } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import config from '../../../../services/web3/config';

import './ChooseTokens.scss';

import ArrowImg from '@/assets/img/icons/arrow-cur.svg';

export interface IChooseTokens {
  handleChangeTokens: (tokens: ITokens) => void;
  initialTokenData?: ITokens;
  isManageTokens?: boolean;
  textFrom?: string;
  textTo?: string;
  changeTokenFromAllowance?: (value: boolean) => void;
  changeTokenToAllowance?: (value: boolean) => void;
}

const ChooseTokens: React.FC<IChooseTokens> = React.memo(
  ({
    handleChangeTokens,
    initialTokenData,
    isManageTokens,
    textFrom,
    textTo,
    changeTokenFromAllowance,
    changeTokenToAllowance,
  }) => {
    const { metamaskService } = useWalletConnectorContext();

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
        if (tokenTo && token.address === tokenTo.address) {
          setTokenTo(tokenFrom);
          setTokenToQuantity(tokenFromQuantity);
          setTokenFromQuantity(tokenToQuantity);
          setTokenFrom(token);

          handleChangeTokens({
            from: {
              token,
              amount: tokenFromQuantity,
            },
            to: {
              token: tokenTo,
              amount: tokenToQuantity,
            },
          });
          return;
        }

        handleChangeTokens({
          from: {
            token,
            amount: tokenFromQuantity,
          },
          to: {
            token: tokenTo,
            amount: tokenToQuantity,
          },
        });
        setTokenFrom(token);
      }
    };

    const handleChangeTokenTo = (token: IToken | undefined): void => {
      if (token) {
        if (tokenFrom && token.address === tokenFrom.address) {
          setTokenFrom(tokenTo);
          setTokenFromQuantity(tokenToQuantity);
          setTokenToQuantity(tokenFromQuantity);
          setTokenTo(token);

          handleChangeTokens({
            from: {
              token: tokenTo,
              amount: tokenToQuantity,
            },
            to: {
              token,
              amount: tokenToQuantity,
            },
          });
          return;
        }

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
        setTokenTo(token);
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

    const handleCheckAllowance = async (inputValue: number | string) => {
      try {
        const promises: any[] = [];
        if (tokenFrom?.address) {
          promises.push(
            metamaskService.checkTokenAllowance({
              contractName: 'ERC20',
              approvedAddress: config.ROUTER.ADDRESS,
              tokenAddress: tokenFrom?.address,
              approveSum: +inputValue,
            }),
          );
        }
        if (tokenTo?.address) {
          promises.push(
            metamaskService.checkTokenAllowance({
              contractName: 'ERC20',
              approvedAddress: config.ROUTER.ADDRESS,
              tokenAddress: tokenTo?.address,
              approveSum: +inputValue,
            }),
          );
        }
        const result = await Promise.all(promises);

        return result;
      } catch (err) {
        console.log(err, 'err check token allowance');
        return '';
      }
    };

    const handleChangeTokensQuantity = async (type: 'from' | 'to', quantity: number) => {
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
      handleCheckAllowance(quantity)
        .then((res: any[] | '') => {
          if (changeTokenFromAllowance) {
            changeTokenFromAllowance(!!res[0]);
          }
          if (changeTokenToAllowance) {
            changeTokenToAllowance(!!res[1]);
          }
        })
        .catch(() => {
          if (changeTokenFromAllowance) {
            changeTokenFromAllowance(false);
          }
          if (changeTokenToAllowance) {
            changeTokenToAllowance(false);
          }
        });
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
