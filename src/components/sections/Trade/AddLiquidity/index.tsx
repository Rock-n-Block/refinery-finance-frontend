import React from 'react';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';

import { TradeBox, ChooseTokens } from '..';
import { ITokens } from '../../../../types';
import { Button } from '../../../atoms';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';
import MetamaskService from '../../../../services/web3';
import Web3Config from '../../../../services/web3/config';

import './AddLiquidity.scss';

interface IAddLiquidity {
  tokensData: ITokens;
  setTokensData: (value: ITokens) => void;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
  txDeadlineUtc: number;
}

interface IPrices {
  first?: number;
  second?: number;
  share?: number;
}

const AddLiquidity: React.FC<IAddLiquidity> = observer(
  ({
    tokensData,
    setTokensData,
    setAllowanceFrom,
    setAllowanceTo,
    isAllowanceFrom,
    handleApproveTokens,
    isAllowanceTo,
    txDeadlineUtc,
  }) => {
    const { metamaskService } = useWalletConnectorContext();
    const { user } = useMst();

    const [exchange, setExchange] = React.useState<IPrices | undefined | null>(undefined);
    const [tokensResurves, setTokensResurves] = React.useState<any>(null);

    const handleCreatePair = async () => {
      try {
        if (tokensData.from.token && tokensData.to.token) {
          await metamaskService.createTransaction({
            contractName: 'ROUTER',
            method: 'addLiquidity',
            data: [
              tokensData.from.token?.address,
              tokensData.to.token?.address,
              MetamaskService.calcTransactionAmount(
                tokensData.from.amount,
                +tokensData.from.token.decimals,
              ),
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token.decimals,
              ),
              MetamaskService.calcTransactionAmount(
                tokensData.from.amount,
                +tokensData.from.token.decimals,
              ),
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token.decimals,
              ),
              user.address,
              txDeadlineUtc,
            ],
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const handleGetExchange = async (tokens: ITokens, type?: 'from' | 'to') => {
      try {
        const pairAddr = await metamaskService.callContractMethod('FACTORY', 'getPair', [
          tokens.from.token?.address,
          tokens.to.token?.address,
        ]);
        if (pairAddr === '0x0000000000000000000000000000000000000000') {
          setExchange(null);
          return;
        }

        if (
          tokens.from.token &&
          tokens.to.token &&
          (tokens.from.amount || tokens.to.amount) &&
          pairAddr
        ) {
          const token0 = await metamaskService.callContractMethodFromNewContract(
            pairAddr,
            Web3Config.PAIR.ABI,
            'token0',
          );

          const token1 = await metamaskService.callContractMethodFromNewContract(
            pairAddr,
            Web3Config.PAIR.ABI,
            'token1',
          );

          const resurves = await metamaskService.callContractMethodFromNewContract(
            pairAddr,
            Web3Config.PAIR.ABI,
            'getReserves',
          );
          setTokensResurves(resurves);

          if (
            (type === 'from' && tokens.from.amount) ||
            (tokens.from.token && tokens.from.amount && !tokens.to.amount)
          ) {
            let resurve1: number;
            let resurve2: number;
            if (tokens.from.token.address.toLowerCase() === token0.toLowerCase()) {
              resurve1 = resurves['0'];
              resurve2 = resurves['1'];
            } else {
              resurve1 = resurves['1'];
              resurve2 = resurves['0'];
            }

            const quote = await metamaskService.callContractMethod('ROUTER', 'quote', [
              MetamaskService.calcTransactionAmount(
                tokens.from.amount,
                +tokens.from.token.decimals,
              ),
              resurve1,
              resurve2,
            ]);

            setTokensData({
              from: {
                token: tokens.from.token,
                amount: tokens.from.amount,
              },
              to: {
                token: tokens.to.token,
                amount: +MetamaskService.amountFromGwei(+quote, +tokens.to.token.decimals),
              },
            });
          } else if (
            (type === 'to' && tokens.to.amount) ||
            (tokens.to.token && tokens.to.amount && !tokens.from.amount)
          ) {
            let resurve1: number;
            let resurve2: number;
            if (tokens.to.token.address.toLowerCase() === token1.toLowerCase()) {
              resurve1 = resurves['1'];
              resurve2 = resurves['0'];
            } else {
              resurve1 = resurves['0'];
              resurve2 = resurves['1'];
            }
            const quote = await metamaskService.callContractMethod('ROUTER', 'quote', [
              MetamaskService.calcTransactionAmount(tokens.to.amount, +tokens.to.token.decimals),
              resurve1,
              resurve2,
            ]);

            setTokensData({
              from: {
                token: tokens.from.token,
                amount: +MetamaskService.amountFromGwei(+quote, +tokens.from.token.decimals),
              },
              to: {
                token: tokens.to.token,
                amount: tokens.to.amount,
              },
            });
          } else {
            setTokensData(tokens);
          }
        }
      } catch (err) {
        console.log('get pair', err);
      }
    };

    const handleChangeTokensData = async (tokens: ITokens, type?: 'from' | 'to') => {
      if (tokens.from.amount === 0 || tokens.to.amount === 0) {
        setTokensData({
          from: {
            token: tokens.from.token,
            amount: 0,
          },
          to: {
            token: tokens.to.token,
            amount: 0,
          },
        });
      } else if (tokens.from.token && tokens.to.token) {
        handleGetExchange(tokens, type);
      } else {
        setTokensData(tokens);
      }
    };

    React.useEffect(() => {
      if (
        tokensData.from.amount &&
        tokensData.to.amount &&
        tokensResurves &&
        tokensData.from.token &&
        tokensData.to.token
      ) {
        try {
          const token1 = new BigNumber(
            MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token.decimals,
            ),
          ).toString(10);
          const token2 = new BigNumber(
            MetamaskService.calcTransactionAmount(
              tokensData.to.amount,
              +tokensData.to.token.decimals,
            ),
          ).toString(10);
          const share1 = new BigNumber(token1)
            .dividedBy(new BigNumber(tokensResurves['0']).plus(tokensResurves['1']).plus(token1))
            .toString(10);
          const share2 = new BigNumber(token2)
            .dividedBy(new BigNumber(tokensResurves['0']).plus(tokensResurves['1']).plus(token2))
            .toString(10);
          const min = BigNumber.min(share1, share2).toString(10);

          setExchange((ex) => ({
            ...ex,
            share: +min,
          }));

          metamaskService
            .callContractMethod('ROUTER', 'getAmountsOut', [
              MetamaskService.calcTransactionAmount(
                tokensData.from.amount,
                +tokensData.from.token.decimals,
              ),
              [tokensData.to.token.address, tokensData.from.token.address],
            ])
            .then((res) => {
              if (tokensData.from.token) {
                const amount = +MetamaskService.amountFromGwei(
                  res[1],
                  +tokensData.from.token?.decimals,
                );
                setExchange((data) => ({
                  ...data,
                  first: amount,
                }));
              }
            });
          metamaskService
            .callContractMethod('ROUTER', 'getAmountsOut', [
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token.decimals,
              ),
              [tokensData.from.token.address, tokensData.to.token.address],
            ])
            .then((res) => {
              if (tokensData.to.token) {
                const amount = +MetamaskService.amountFromGwei(
                  res[1],
                  +tokensData.to.token?.decimals,
                );
                setExchange((data) => ({
                  ...data,
                  second: amount,
                }));
              }
            });
        } catch (err) {
          console.log(err, 'err');
        }
      }
    }, [
      tokensData.from.token,
      tokensData.to.token,
      tokensData.from.amount,
      tokensData.to.amount,
      tokensResurves,
      metamaskService,
    ]);

    return (
      <TradeBox
        className="add-liquidity"
        title="Add Liquidity"
        subtitle="Add liquidity to receive LP tokens"
        settingsLink="/trade/liquidity/settings"
        recentTxLink="/trade/liquidity/history"
        info="info"
        titleBackLink
      >
        {exchange === null ? 'your first provider' : ''}
        <ChooseTokens
          handleChangeTokens={handleChangeTokensData}
          initialTokenData={tokensData}
          textFrom="Input"
          textTo="Input"
          changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
          changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
        />
        {tokensData.from.token &&
        tokensData.to.token &&
        exchange &&
        (exchange.first || exchange.first === 0) &&
        (exchange.second || exchange.second === 0) &&
        (exchange.share || exchange.share === 0) ? (
          <div className="add-liquidity__info">
            <div className="add-liquidity__info-title text-smd text-purple text-center">
              Prices and pool share
            </div>
            <div className="add-liquidity__info-content">
              <div className="add-liquidity__info-item">
                <div className="text-ssm text-center text-purple add-liquidity__info-item-title">
                  {new BigNumber(exchange.first).toString(10)}
                </div>
                <div className="text-ssm text-center text-purple">
                  {tokensData.from.token.symbol} per {tokensData.to.token.symbol}
                </div>
              </div>
              <div className="add-liquidity__info-item">
                <div className="text-ssm text-center text-purple add-liquidity__info-item-title">
                  {new BigNumber(exchange.second).toString(10)}
                </div>
                <div className="text-ssm text-center text-purple">
                  {tokensData.to.token.symbol} per {tokensData.from.token.symbol}
                </div>
              </div>
              <div className="add-liquidity__info-item">
                <div className="text-ssm text-center text-purple add-liquidity__info-item-title">
                  {exchange.share < 0.001 ? 0 : new BigNumber(exchange.share).toString(10)}%
                </div>
                <div className="text-ssm text-center text-purple">Share of Pool</div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {isAllowanceFrom &&
        isAllowanceTo &&
        tokensData.from.token &&
        tokensData.to.token &&
        tokensData.to.amount &&
        tokensData.from.amount ? (
          <Button
            className="add-liquidity__btn"
            disabled={!tokensData.from.amount || !tokensData.to.amount}
            onClick={handleCreatePair}
          >
            <span className="text-white text-bold text-smd">Add</span>
          </Button>
        ) : (
          ''
        )}
        {tokensData.from.token &&
        tokensData.to.token &&
        (!tokensData.to.amount || !tokensData.from.amount) ? (
          <Button
            className="add-liquidity__btn"
            disabled={!tokensData.from.amount || !tokensData.to.amount}
          >
            <span className="text-white text-bold text-smd">Enter an amount</span>
          </Button>
        ) : (
          ''
        )}
        {(!isAllowanceFrom || !isAllowanceTo) &&
        tokensData.from.token &&
        tokensData.to.token &&
        tokensData.to.amount &&
        tokensData.from.amount ? (
          <Button className="add-liquidity__btn" onClick={handleApproveTokens}>
            <span className="text-white text-bold text-smd">Approve tokens</span>
          </Button>
        ) : (
          ''
        )}
        {!tokensData.from.token || !tokensData.to.token ? (
          <Button disabled className="add-liquidity__btn">
            <span className="text-white text-bold text-smd">Select a Tokens</span>
          </Button>
        ) : (
          ''
        )}
      </TradeBox>
    );
  },
);

export default AddLiquidity;
