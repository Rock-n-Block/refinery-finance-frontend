import React from 'react';

import { TradeBox, ChooseTokens } from '..';
import { ITokens } from '../../../../types';
import { Button } from '../../../atoms';

import './AddLiquidity.scss';

interface IAddLiquidity {
  tokensData: ITokens;
  setTokensData: (value: ITokens) => void;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
}

const AddLiquidity: React.FC<IAddLiquidity> = ({
  tokensData,
  setTokensData,
  setAllowanceFrom,
  setAllowanceTo,
  isAllowanceFrom,
  handleApproveTokens,
  isAllowanceTo,
}) => {
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
        handleChangeTokens={setTokensData}
        initialTokenData={tokensData}
        isManageTokens
        textFrom="Input"
        textTo="Input"
        changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
        changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
      />
      {tokensData.from.token && tokensData.to.token ? (
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
          <span className="text-white text-bold text-smd">
            {!tokensData.from.amount || !tokensData.to.amount ? 'Enter an amount' : 'Add'}
          </span>
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
};

export default AddLiquidity;
