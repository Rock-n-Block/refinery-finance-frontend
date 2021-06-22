import React from 'react';

import { TradeBox, ChooseTokens } from '..';
import { ITokens } from '../../../../types';
import { Button } from '../../../atoms';

import './AddLiquidity.scss';

const AddLiquidity: React.FC = () => {
  const [tokensData, setTokensData] = React.useState<ITokens>({
    from: {
      token: undefined,
      amount: NaN,
    },
    to: {
      token: undefined,
      amount: NaN,
    },
  });
  console.log(tokensData);

  const handleSetTokens = (tokens: ITokens) => {
    setTokensData(tokens);
  };

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
        handleChangeTokens={handleSetTokens}
        initialTokenData={tokensData}
        isManageTokens
        textFrom="Input"
        textTo="Input"
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
      <Button
        className="add-liquidity__btn"
        disabled={
          !tokensData.from.token ||
          !tokensData.to.token ||
          !tokensData.from.amount ||
          !tokensData.to.amount
        }
      >
        <span className="text-white text-bold text-smd">Add</span>
      </Button>
    </TradeBox>
  );
};

export default AddLiquidity;
