import React from 'react';
import { observer } from 'mobx-react-lite';

import { InputNumber } from '@/components/atoms';
import { useMst } from '@/store';
import { IPoolFarmingMode, PoolFarmingMode, Token } from '@/types';

import CollectButton from '../../CollectButton';

interface IRecentProfitProps {
  farmMode: IPoolFarmingMode;
  tokenStake: Token;
  value: number;
  onCollect: () => void;
}

const RecentProfit: React.FC<IRecentProfitProps> = observer(
  ({ farmMode, tokenStake, value, onCollect }) => {
    const { user } = useMst();
    const hasConnectedWallet = Boolean(user.address);
    return (
      <div className="pools-table-row__details-box">
        <div className="pools-table-row__details-title text-purple text-ssm text-med text-upper">
          recent {tokenStake.symbol} profit
        </div>
        <InputNumber
          colorScheme="white"
          value={value}
          inputPrefix={
            hasConnectedWallet &&
            (farmMode === PoolFarmingMode.earn || farmMode === PoolFarmingMode.manual) ? (
              <CollectButton farmMode={farmMode} value={value} collectHandler={onCollect} />
            ) : undefined
          }
          readOnly
        />
      </div>
    );
  },
);

export default RecentProfit;
