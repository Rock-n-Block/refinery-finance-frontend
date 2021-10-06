import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import OpenLink from '@/components/sections/Pools/OpenLink';
import { getPoolBlockInfo } from '@/components/sections/Pools/PoolCard/utils';
import { TotalStakedPopover } from '@/components/sections/Pools/Popovers';
import { useScannerUrl } from '@/hooks/useScannerUrl';
import { getAddress, getContractAddress } from '@/services/web3/contractHelpers';
import { useBlock } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { useSelectVaultData } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { feeFormatter, loadingDataFormatter, numberWithCommas } from '@/utils';

const CardDetails: React.FC<{ type: IPoolFarmingMode; pool: Pool }> = observer(({ pool, type }) => {
  const {
    pools: {
      fees: { performanceFee },
    },
  } = useMst();
  const [currentBlock] = useBlock();
  const {
    shouldShowBlockCountdown,
    // blocksUntilStart,
    // blocksRemaining,
    // hasPoolStarted,
    blocksToDisplay,
  } = getPoolBlockInfo(pool, currentBlock);
  const { totalRefineryInVault } = useSelectVaultData();
  const { earningToken, stakingToken, totalStaked } = pool;
  const seeTokenInfoLink = useScannerUrl(`token/${getAddress(earningToken.address)}`);
  const viewContractLink = useScannerUrl(
    `address/${
      type === PoolFarmingMode.auto
        ? getContractAddress('REFINERY_VAULT')
        : getAddress(pool.contractAddress)
    }`,
  );
  const totalStakedBalance = useMemo(() => {
    switch (type) {
      case PoolFarmingMode.auto:
        return loadingDataFormatter(totalRefineryInVault, { decimals: stakingToken.decimals });
      case PoolFarmingMode.manual: {
        if (!totalStaked || !totalRefineryInVault) return loadingDataFormatter();
        return loadingDataFormatter(new BigNumber(totalStaked).minus(totalRefineryInVault), {
          decimals: stakingToken.decimals,
        });
      }
      case PoolFarmingMode.earn:
      default:
        return loadingDataFormatter(totalStaked, { decimals: stakingToken.decimals });
    }
  }, [type, stakingToken.decimals, totalRefineryInVault, totalStaked]);
  const performanceRow = useMemo(() => {
    return type === PoolFarmingMode.auto
      ? [
          {
            title: 'Performance Fee:',
            value: <>{feeFormatter(performanceFee)}%</>,
          },
        ]
      : [];
  }, [performanceFee, type]);

  const endsInRow = useMemo(() => {
    return shouldShowBlockCountdown
      ? [
          {
            title: 'Ends in:',
            value: (
              <>
                <span>{numberWithCommas(blocksToDisplay)} blocks</span>
                {/* TODO: copy/paste value like in table row */}
              </>
            ),
          },
        ]
      : [];
  }, [shouldShowBlockCountdown, blocksToDisplay]);
  const items = [
    {
      title: 'Total staked:',
      value: (
        <>
          <span>{totalStakedBalance}</span>
          <TotalStakedPopover symbol={stakingToken.symbol} />
        </>
      ),
    },
    ...performanceRow,
    ...endsInRow,
  ];
  const links = [
    {
      href: earningToken.address ? seeTokenInfoLink : '',
      text: 'See Token Info',
    },
    {
      href: earningToken.projectLink,
      text: 'View Project Site',
    },
    {
      href: viewContractLink,
      text: 'View Contract',
    },
  ];
  return (
    <div className="p-card__details">
      {items.map(({ title, value }) => {
        return (
          <div key={title} className="p-card__details-item box-f-ai-c box-f-jc-sb ">
            <div className="p-card__details-item-name text-smd text-purple text-med">{title}</div>
            <div className="p-card__details-item-value text-smd box-f-ai-c">{value}</div>
          </div>
        );
      })}
      {links.map(({ href, text }) => (
        <OpenLink key={href + text} className="p-card__details-item" href={href} text={text} />
      ))}
    </div>
  );
});

export default CardDetails;
