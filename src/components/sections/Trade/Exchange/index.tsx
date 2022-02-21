import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { clogError } from '@/utils/logger';

import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import MetamaskService from '../../../../services/web3';
import { useMst } from '../../../../store';
import { ISettings, ITokens } from '../../../../types';
import { Button } from '../../../atoms';
import { ChooseTokens, TradeBox } from '..';

import './Exchange.scss';

interface IExchange {
  tokensData: ITokens;
  setTokensData: (value: ITokens, type?: 'from' | 'to') => void;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
  settings: ISettings;
  tokensResurves: any;
  maxFrom: '';
  maxTo: '';
  isLoadingExchange: boolean;
  isApproving: boolean;
  transactionPath: string[];
  setPath: (path: string[]) => void;
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
    settings,
    tokensResurves,
    isLoadingExchange,
    isApproving,
    transactionPath,
    setPath,
  }) => {
    const { connect, metamaskService } = useWalletConnectorContext();
    const { user } = useMst();
    const [isSwapping, setSwapping] = useState(false);

    const handleSwap = async () => {
      if (tokensData.to.token && tokensData.from.token) {
        try {
          setSwapping(true);
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
              transactionPath,
              // [tokensData.from.token.address, tokensData.to.token.address],
              user.address,
              settings.txDeadlineUtc,
            ],
          });
          successNotification(
            `Successful exchange of  ${tokensData.from.token.symbol} for  ${tokensData.to.token.symbol}`,
          );
          setSwapping(false);
          delete localStorage['refinery-finance-getAmountOut'];
          setTokensData({
            from: {
              token: undefined,
              amount: NaN,
            },
            to: {
              token: undefined,
              amount: NaN,
            },
          });
          setPath([]);
        } catch (err) {
          clogError('swap err', err);
          errorNotification('Something went wrong, check your wallet');
          setSwapping(false);
        }
      }
    };
    // React.useEffect(() => {
    //   console.log(tokensData.from.amount > maxFrom, tokensData.to.amount, maxTo);
    // }, [maxFrom, maxTo, tokensData]);

    return (
      <>
        <TradeBox
          title="Exchange"
          subtitle="Trade tokens in an instant"
          settingsLink="/settings"
          recentTxLink="/history"
        >
          <ChooseTokens
            handleChangePath={setPath}
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
              disabled={+tokensData.from.amount > +maxFrom || +tokensData.to.amount > +maxTo}
              loading={isLoadingExchange || isSwapping}
              loadingText={
                // eslint-disable-next-line no-nested-ternary
                isLoadingExchange ? 'Geting exchange...' : isSwapping ? 'In progress...' : ''
              }
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
            <Button
              className="exchange__btn"
              onClick={handleApproveTokens}
              loading={isApproving}
              disabled={tokensData.to.amount > maxTo || tokensData.from.amount > maxFrom}
            >
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
