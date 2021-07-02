import React from 'react';
import { observer } from 'mobx-react-lite';

import { TradeBox, ChooseTokens } from '..';
import { Button } from '../../../atoms';
import { ITokens } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';

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
  }) => {
    const connector = useWalletConnectorContext();
    const { user } = useMst();

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
            textFrom="Input"
            textTo="Input"
            changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
            changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
          />
          {isAllowanceFrom &&
          isAllowanceTo &&
          tokensData.from.token &&
          tokensData.to.token &&
          tokensData.to.amount &&
          tokensData.from.amount &&
          user.address ? (
            <Button className="exchange__btn">
              <span className="text-white text-bold text-smd">Swap</span>
            </Button>
          ) : (
            ''
          )}
          {isAllowanceFrom &&
          isAllowanceTo &&
          tokensData.from.token &&
          tokensData.to.token &&
          tokensData.to.amount &&
          tokensData.from.amount &&
          !user.address ? (
            <Button className="exchange__btn" onClick={connector.connect}>
              <span className="text-bold text-md text-white">Connect</span>
            </Button>
          ) : (
            ''
          )}
          {tokensData.from.token &&
          tokensData.to.token &&
          (!tokensData.to.amount || !tokensData.from.amount) ? (
            <Button
              className="exchange__btn"
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
            <Button className="exchange__btn" onClick={handleApproveTokens}>
              <span className="text-white text-bold text-smd">Approve tokens</span>
            </Button>
          ) : (
            ''
          )}
          {!tokensData.from.token || !tokensData.to.token ? (
            <Button disabled className="exchange__btn">
              <span className="text-white text-bold text-smd">Select a Tokens</span>
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
