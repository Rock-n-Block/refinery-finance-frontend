import React from 'react';

import { InputNumber } from '@/components/atoms';
import { IPoolFarmingMode, Token } from '@/types';

import CollectButton from '../../CollectButton';

interface IRecentProfitProps {
  farmMode: IPoolFarmingMode;
  tokenStake: Token;
  value: number;
  onCollect: () => void;
}

const RecentProfit: React.FC<IRecentProfitProps> = ({ farmMode, tokenStake, value, onCollect }) => {
  return (
    <div className="pools-table-row__details-box">
      <div className="pools-table-row__details-title text-purple text-ssm text-med text-upper">
        recent {tokenStake.symbol} profit
      </div>
      <InputNumber
        colorScheme="white"
        value={value}
        inputPrefix={<CollectButton farmMode={farmMode} value={value} collectHandler={onCollect} />}
        readOnly
      />
    </div>
  );
};

export default RecentProfit;
