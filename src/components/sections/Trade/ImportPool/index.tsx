import React from 'react';

import { TradeBox, ChooseTokens } from '..';
import { ITokens } from '../../../../types';

import './ImportPool.scss';

import BnbImg from '@/assets/img/currency/bnb.svg';

const ImportPool: React.FC = () => {
  const [tokensData, setTokensData] = React.useState<ITokens>({
    from: {
      token: {
        img: BnbImg,
        name: 'Binance',
        symbol: 'BNB',
      },
      amount: NaN,
    },
    to: {
      token: undefined,
      amount: NaN,
    },
  });

  const handleSetTokens = (tokens: ITokens) => {
    setTokensData(tokens);
  };

  return (
    <TradeBox
      className="import-pool"
      title="Import Pool"
      subtitle="Import an existing pool"
      settingsLink="/trade/liquidity/settings"
      recentTxLink="/trade/liquidity/history"
      titleBackLink
    >
      <ChooseTokens
        handleChangeTokens={handleSetTokens}
        initialTokenData={tokensData}
        isManageTokens
      />
      <div className="text-gray import-pool__text text-center">
        Select a token to find your liquidity.
      </div>
    </TradeBox>
  );
};

export default ImportPool;
