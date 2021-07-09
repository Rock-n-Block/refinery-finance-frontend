import React from 'react';
import { observer } from 'mobx-react-lite';

import { TradeBox, ChooseTokens } from '..';
import { Button } from '../../../atoms';
import { ITokens } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';
import MetamaskService from '../../../../services/web3';

import './Exchange.scss';

interface IExchange {
  tokensData: ITokens;
  setTokensData: (value: ITokens) => void;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
  txDeadlineUtc: number;
  tokensResurves: any;
  maxFrom: '';
  maxTo: '';
  isLoadingExchange: boolean;
}

const Exchange: React.FC<IExchange> = observer(
  ({
    tokensData,
    setTokensData,
    setAllowanceFrom,
    setAllowanceTo,
    isAllowanceFrom,
    handleApproveTokens,
    isAllowanceTo,
    maxFrom,
    maxTo,
    txDeadlineUtc,
    tokensResurves,
    isLoadingExchange,
  }) => {
    const { connect, metamaskService } = useWalletConnectorContext();
    const { user } = useMst();

    const handleSwap = async () => {
      if (tokensData.to.token && tokensData.from.token) {
        try {
          await metamaskService.createTransaction({
            method: 'swapExactTokensForTokens',
            contractName: 'ROUTER',
            data: [
              MetamaskService.calcTransactionAmount(
                tokensData.from.amount,
                +tokensData.from.token?.decimals,
              ),
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token?.decimals,
              ),
              [tokensData.from.token.address, tokensData.to.token.address],
              user.address,
              txDeadlineUtc,
            ],
          });
          setTokensData({
            from: {
              token: tokensData.from.token,
              amount: NaN,
            },
            to: {
              token: tokensData.to.token,
              amount: NaN,
            },
          });
        } catch (err) {
          console.log('swap err', err);
        }
      }
    };

    return (
      <>
        <TradeBox
          title="Exchange"
          subtitle="Trade tokens in an instant"
          settingsLink="/trade/swap/settings"
          recentTxLink="/trade/swap/history"
        >
          <ChooseTokens
            handleChangeTokens={setTokensData}
            initialTokenData={tokensData}
            textFrom="From"
            textTo="To"
            changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
            changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
            maxFrom={maxFrom}
            maxTo={maxTo}
          />
          {isAllowanceFrom &&
          isAllowanceTo &&
          tokensData.from.token &&
          tokensData.to.token &&
          tokensData.to.amount &&
          tokensData.from.amount &&
          user.address &&
          tokensResurves !== null ? (
            <Button
              className="exchange__btn"
              onClick={handleSwap}
              loading={isLoadingExchange}
              loadingText={isLoadingExchange ? 'Geting exchange' : ''}
            >
              <span className="text-white text-bold text-smd">Swap</span>
            </Button>
          ) : (
            ''
          )}
          {!user.address ? (
            <Button className="exchange__btn" onClick={connect}>
              <span className="text-bold text-md text-white">Connect</span>
            </Button>
          ) : (
            ''
          )}
          {tokensData.from.token &&
          tokensData.to.token &&
          (!tokensData.to.amount || !tokensData.from.amount) &&
          tokensResurves !== null &&
          user.address ? (
            <Button
              className="exchange__btn"
              disabled={!tokensData.from.amount || !tokensData.to.amount}
              loading={isLoadingExchange}
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
          tokensData.from.amount &&
          tokensResurves !== null &&
          user.address ? (
            <Button className="exchange__btn" onClick={handleApproveTokens}>
              <span className="text-white text-bold text-smd">Approve tokens</span>
            </Button>
          ) : (
            ''
          )}
          {(!tokensData.from.token || !tokensData.to.token) &&
          tokensResurves !== null &&
          user.address ? (
            <Button disabled className="exchange__btn">
              <span className="text-white text-bold text-smd">Select a Tokens</span>
            </Button>
          ) : (
            ''
          )}
          {tokensData.from.token &&
          tokensData.to.token &&
          tokensResurves === null &&
          user.address ? (
            <Button disabled className="exchange__btn">
              <span className="text-white text-bold text-smd">
                This pair haven&lsquo;t been created
              </span>
            </Button>
          ) : (
            ''
          )}
        </TradeBox>
      </>
    );
  },
);

export default Exchange;
