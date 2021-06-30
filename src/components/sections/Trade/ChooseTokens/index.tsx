import React from 'react';

import { InputNumber, Button } from '../../../atoms';
import { SelectTokenModal } from '..';
import { ITokens, IToken } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import config from '../../../../services/web3/config';

import './ChooseTokens.scss';

import ArrowImg from '@/assets/img/icons/arrow-cur.svg';

export interface IChooseTokens {
  handleChangeTokens: (tokens: ITokens, type?: 'from' | 'to') => void;
  initialTokenData?: ITokens;
  textFrom?: string;
  textTo?: string;
  changeTokenFromAllowance?: (value: boolean) => void;
  changeTokenToAllowance?: (value: boolean) => void;
}

const ChooseTokens: React.FC<IChooseTokens> = React.memo(
  ({
    handleChangeTokens,
    initialTokenData,
    textFrom,
    textTo,
    changeTokenFromAllowance,
    changeTokenToAllowance,
  }) => {
    const { metamaskService } = useWalletConnectorContext();

    const [time, setTime] = React.useState<any>(null);

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

          handleChangeTokens(
            {
              from: {
                token,
                amount: initialTokenData?.to.amount || NaN,
              },
              to: {
                token: initialTokenData?.from.token,
                amount: initialTokenData?.from.amount || NaN,
              },
            },
            'from',
          );
          return;
        }

        handleChangeTokens(
          {
            from: {
              token,
              amount: initialTokenData?.from.amount || NaN,
            },
            to: {
              token: initialTokenData?.to.token,
              amount: initialTokenData?.to.amount || NaN,
            },
          },
          'from',
        );
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

          handleChangeTokens(
            {
              from: {
                token: initialTokenData?.to.token,
                amount: initialTokenData?.to.amount || NaN,
              },
              to: {
                token,
                amount: initialTokenData?.from.amount || NaN,
              },
            },
            'to',
          );
          return;
        }

        handleChangeTokens(
          {
            from: {
              token: tokenFrom,
              amount: tokenFromQuantity,
            },
            to: {
              token,
              amount: tokenToQuantity,
            },
          },
          'to',
        );
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

    const handleSwapPositions = () => {
      if (initialTokenData) {
        setTokenFrom(initialTokenData.to.token);
        setTokenTo(initialTokenData.from.token);
        handleChangeTokens({
          from: initialTokenData.to,
          to: initialTokenData.from,
        });
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
        if (changeTokenFromAllowance) {
          changeTokenFromAllowance(!!result[0]);
        }
        if (changeTokenToAllowance) {
          changeTokenToAllowance(!!result[1]);
        }
        return result;
      } catch (err) {
        console.log(err, 'err check token allowance');

        if (changeTokenFromAllowance) {
          changeTokenFromAllowance(false);
        }
        if (changeTokenToAllowance) {
          changeTokenToAllowance(false);
        }
        return '';
      }
    };

    const handleChangeTokensQuantity = async (type: 'from' | 'to', quantity: number) => {
      if (type === 'from') {
        setTokenFromQuantity(quantity);
        if (time) {
          clearTimeout(time);
          setTime(
            setTimeout(() => {
              handleCheckAllowance(quantity);
              handleChangeTokens(
                {
                  from: {
                    token: tokenFrom,
                    amount: quantity,
                  },
                  to: {
                    token: tokenTo,
                    amount: initialTokenData?.to.amount || NaN,
                  },
                },
                'from',
              );
            }, 500),
          );
        } else {
          setTime(
            setTimeout(() => {
              handleCheckAllowance(quantity);
              handleChangeTokens(
                {
                  from: {
                    token: tokenFrom,
                    amount: quantity,
                  },
                  to: {
                    token: tokenTo,
                    amount: initialTokenData?.to.amount || NaN,
                  },
                },
                'from',
              );
            }, 500),
          );
        }
      }
      if (type === 'to') {
        setTokenToQuantity(quantity);
        if (time) {
          clearTimeout(time);
          setTime(
            setTimeout(() => {
              handleCheckAllowance(quantity);
              handleChangeTokens(
                {
                  from: {
                    token: tokenFrom,
                    amount: initialTokenData?.from.amount || NaN,
                  },
                  to: {
                    token: tokenTo,
                    amount: quantity,
                  },
                },
                'to',
              );
            }, 500),
          );
        } else {
          setTime(
            setTimeout(() => {
              handleCheckAllowance(quantity);
              handleChangeTokens(
                {
                  from: {
                    token: tokenFrom,
                    amount: initialTokenData?.from.amount || NaN,
                  },
                  to: {
                    token: tokenTo,
                    amount: quantity,
                  },
                },
                'to',
              );
            }, 500),
          );
        }
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
                  value={initialTokenData?.from.amount}
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
              onClick={handleSwapPositions}
              onKeyDown={handleSwapPositions}
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
                  value={initialTokenData?.to.amount}
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
        />
      </>
    );
  },
);

export default ChooseTokens;
