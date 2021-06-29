import React from 'react';
import { observer } from 'mobx-react-lite';

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

    const [exchange, setExchange] = React.useState<undefined | boolean>(undefined);

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
        if (tokens.from.token && tokens.to.token) {
          const pairAddr = await metamaskService.callContractMethod('FACTORY', 'getPair', [
            tokens.from.token?.address,
            tokens.to.token?.address,
          ]);
          if (pairAddr === '0x0000000000000000000000000000000000000000') {
            setExchange(false);
            return;
          }
          setExchange(true);

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

          if (type === 'from') {
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
          } else if (type === 'to') {
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

    const handleChangeTokensData = (tokens: ITokens, type?: 'from' | 'to'): void => {
      if (tokens.from.token && tokens.to.token && (tokens.from.amount || tokens.to.amount)) {
        handleGetExchange(tokens, type);
      }
    };

    // React.useEffect(() => {
    //   if (tokensData.from.token && tokensData.to.token && tokensData.from.amount) {
    //     handleGetExchange();
    //   }
    // }, [tokensData.from.token, tokensData.to.token, handleGetExchange, tokensData.from.amount]);

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
        <ChooseTokens
          handleChangeTokens={handleChangeTokensData}
          initialTokenData={tokensData}
          isManageTokens
          textFrom="Input"
          textTo="Input"
          changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
          changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
        />
        {tokensData.from.token && tokensData.to.token && exchange ? (
          <div className="add-liquidity__info">
            <div className="add-liquidity__info-title text-smd text-purple text-center">
              Prices and pool share
            </div>
            <div className="add-liquidity__info-content">
              <div className="add-liquidity__info-item">
                <div className="text-ssm text-center text-purple add-liquidity__info-item-title">
                  19.2704
                </div>
                <div className="text-ssm text-center text-purple">BUNNY per BNB</div>
              </div>
              <div className="add-liquidity__info-item">
                <div className="text-ssm text-center text-purple add-liquidity__info-item-title">
                  19.2704
                </div>
                <div className="text-ssm text-center text-purple">BNB per BUNNY</div>
              </div>
              <div className="add-liquidity__info-item">
                <div className="text-ssm text-center text-purple add-liquidity__info-item-title">
                  0%
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
