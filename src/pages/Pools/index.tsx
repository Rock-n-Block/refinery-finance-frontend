import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { ReactComponent as CardViewIcon } from '@/assets/img/icons/card-view.svg';
import { ReactComponent as ListViewIcon } from '@/assets/img/icons/list-view.svg';
import { Button } from '@/components/atoms';
import { CollectModal, ItemsController, StakeUnstakeModal } from '@/components/organisms';
import { PoolCard, PoolsPreview, PoolTable } from '@/components/sections/Pools';
// import { IPoolCard } from '@/components/sections/Pools/PoolCard';
import { useMst } from '@/store';
import { usePools } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { BIG_ZERO } from '@/utils';

import './Pools.scss';

enum PoolsContentView {
  list = 'list',
  card = 'card',
}
interface IPoolsContent {
  view: PoolsContentView;
  content: Pool[];
}

const ListCardViewButtons: React.FC<{
  view: PoolsContentView;
  onChange: (value: boolean) => void;
}> = ({ view, onChange }) => {
  const prefixContainer = [
    {
      key: 'list-view-mode',
      icon: ListViewIcon,
      handler: () => onChange(true),
      activeClassCondition: view === PoolsContentView.list,
      title: 'List View',
    },
    {
      key: 'card-view-mode',
      icon: CardViewIcon,
      handler: () => onChange(false),
      activeClassCondition: view === PoolsContentView.card,
      title: 'Card View',
    },
  ];

  return (
    <div className="pools__i-contr-prefix box-f-ai-c">
      {prefixContainer.map((item) => {
        const { key, handler, activeClassCondition, title } = item;
        return (
          <Button
            key={key}
            className="pools__i-contr-button"
            title={title}
            colorScheme="white"
            size="ssm"
            onClick={handler}
          >
            <item.icon
              className={cn('pools__i-contr-icon', {
                'pools__i-contr-icon_active': activeClassCondition,
              })}
            />
          </Button>
        );
      })}
    </div>
  );
};

const PoolsContent: React.FC<IPoolsContent> = ({ view, content }) => {
  return (
    <div className="pools__content">
      <div className={`pools__content-${view}-view`}>
        {view === PoolsContentView.list && <PoolTable data={content} />}
        {view === PoolsContentView.card &&
          content.map((pool) => {
            let farmMode: IPoolFarmingMode;
            if (pool.isAutoVault) {
              farmMode = PoolFarmingMode.auto;
            } else if (pool.id === 0) {
              farmMode = PoolFarmingMode.manual;
            } else {
              farmMode = PoolFarmingMode.earn;
            }
            return (
              <PoolCard
                // {...pool}
                // `${pool.tokenEarn?.address}${pool.tokenStake.address}`
                key={pool.isAutoVault ? 'auto-pool' : pool.id}
                farmMode={farmMode}
                pool={pool}
              />
            );
          })}
      </div>
    </div>
  );
};

// const pools: IPoolCard[] = [
//   {
//     tokenEarn: {
//       name: 'WBNB Token',
//       symbol: 'WBNB',
//       address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
//       chainId: 56,
//       decimals: 18,
//       logoURI:
//         'https://tokens.pancakeswap.finance/images/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
//     },
//     tokenStake: {
//       name: 'PancakeSwap Token',
//       symbol: 'CAKE',
//       address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
//       chainId: 56,
//       decimals: 18,
//       logoURI:
//         'https://tokens.pancakeswap.finance/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
//     },
//     type: 'earn',
//     apr: {
//       value: 143.3323,
//       items: [
//         {
//           timeframe: '1D',
//           roi: 0.19,
//           rf: 0.12,
//         },
//         {
//           timeframe: '7D',
//           roi: 1.43,
//           rf: 0.88,
//         },
//       ],
//     },
//   },
//   {
//     tokenStake: {
//       name: 'Cake',
//       symbol: 'CAKE',
//       address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
//       chainId: 56,
//       decimals: 18,
//       logoURI:
//         'https://tokens.pancakeswap.finance/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
//     },
//     type: 'auto',
//     apr: {
//       value: 90.6,
//       items: [
//         {
//           timeframe: '1D',
//           roi: 0.19,
//           rf: 0.12,
//         },
//         {
//           timeframe: '7D',
//           roi: 1.43,
//           rf: 0.88,
//         },
//       ],
//     },
//   },
// ];

enum FilterBy {
  name = 'name',
  stakedOnly = 'stakedOnly',
  poolsType = 'poolsType',
}
type IFilterBy = keyof typeof FilterBy;
type IFilterFunc = (pool: Pool) => boolean | typeof Array.prototype.filter;

enum PoolsType {
  live = 'live',
  finished = 'finished',
}
type IPoolsType = keyof typeof PoolsType;

enum SortOptions {
  hot = 'Hot',
  apr = 'APR',
  earned = 'Earned',
  totalStaked = 'Total staked',
}

// type ISortOptions = keyof typeof SortOptions;

const Pools: React.FC = observer(() => {
  const { user, pools: poolsStore } = useMst();
  const { pools: poolsWithoutAutoVault } = usePools();
  // const [filteredPools, setFilteredPools] = useState(poolsWithoutAutoVault);
  const [appliedFilters, setAppliedFilters] = useState<Map<IFilterBy, IFilterFunc>>(new Map());
  const [isListView, setIsListView] = useState(false);
  // const [poolsTypeFilter, setPoolsTypeFilter] = useState(PoolsType.live);
  const [sortOption, setSortOption] = useState(SortOptions.hot);

  const filter = useCallback(() => {
    return [...appliedFilters.values()].reduce((acc, filterFunc) => {
      return acc.filter(filterFunc);
    }, poolsWithoutAutoVault);
  }, [appliedFilters, poolsWithoutAutoVault]);

  const sort = useCallback(
    (array: typeof poolsWithoutAutoVault) => {
      let sortFunc: (pool1: typeof array[0], pool2: typeof array[0]) => number;
      switch (sortOption) {
        default: {
          sortFunc = () => 0;
          break;
        }
        // case SortOptions.apr: {
        //   sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
        //     String(b).localeCompare(String(a));
        //   break;
        // }
        // case SortOptions.earned: {
        //   // TODO:
        //   sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
        //     String(b).localeCompare(String(a));
        //   break;
        // }
        // case SortOptions.totalStaked: {
        //   // TODO:
        //   sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
        //     String(b).localeCompare(String(a));
        //   break;
        // }
        // case SortOptions.hot:
        // default: {
        //   // TODO:
        //   sortFunc = ({ tokenStake: { symbol: a } }, { tokenStake: { symbol: b } }) =>
        //     a.localeCompare(b);
        //   break;
        // }
      }
      return [...array].sort(sortFunc);
    },
    [sortOption],
  );

  const filteredPools = useMemo(() => {
    // useEffect(() => {
    //   setFilteredPools(sort(filter()));
    // }, [filter, sort]);
    return sort(filter());
  }, [sort, filter]);

  const pools = useMemo(() => {
    const refinerPool = filteredPools.find((pool) => pool.id === 0);
    let refinerAutoVault: Pool;
    if (refinerPool) {
      refinerAutoVault = { ...refinerPool, isAutoVault: true };
      return [refinerAutoVault, ...filteredPools];
    }
    return filteredPools;
  }, [filteredPools]);

  const handleSwitchView = (value: boolean) => {
    setIsListView(value);
  };

  const filterByStakedOnly = (value: BigNumber, isStaked: boolean) => {
    if (!isStaked) return true; // show all
    return !Number.isNaN(value.toNumber()) && value.gt(0);
  };

  const filterByName = (whereToFind: string, toBeFound: string) => {
    return whereToFind.toUpperCase().startsWith(String(toBeFound).toUpperCase());
  };

  const handleStakedSwitchChange: SwitchClickEventHandler = (isStaked) => {
    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [
          FilterBy.stakedOnly,
          ({ userData }) =>
            filterByStakedOnly(
              userData?.stakedBalance ? userData.stakedBalance : BIG_ZERO,
              isStaked,
            ),
        ],
      ]),
    );
  };

  const handleSearch = (value: string | number) => {
    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [FilterBy.name, ({ stakingToken }) => filterByName(stakingToken.symbol, String(value))],
      ]),
    );
  };

  const handleRadioGroupChange = (e: RadioChangeEvent) => {
    // setPoolsTypeFilter(e.target.value);
    const selectedTab: IPoolsType = e.target.value;
    const isOpenedLiveTab = PoolsType.live === selectedTab;

    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [
          FilterBy.poolsType,
          ({ isFinished = false }) => {
            if (isOpenedLiveTab) return !isFinished;
            return isFinished;
          },
        ],
      ]),
    );
  };

  const handleSortSelectChange = (selected: any) => {
    const { value } = selected;
    setSortOption(value as SortOptions);
    console.log(value);
  };

  // console.log(setFilteredPools, filter, sort);

  // useEffect(() => {
  //   setFilteredPools(sort(filter()));
  // }, [filter, sort]);

  // useEffect(() => {
  //   // poolsStore.fetchFees();
  //   // poolsStore.fetchPublicVaultData();
  //   poolsStore.useFetchVaultData();
  // }, [poolsStore]);

  // const { fetchFees, fetchPublicVaultData, fetchVaultUserData } = poolsStore.useFetchVaultData();

  // <-- Fetch Vault Data -->
  useEffect(() => {
    poolsStore.fetchVaultPublicData();
    poolsStore.fetchVaultFees();
  }, [poolsStore]);

  useEffect(() => {
    if (user.address) {
      poolsStore.fetchVaultUserData(user.address);
    }
  }, [poolsStore, user.address]);

  // <-- Fetch Pools Data -->
  useEffect(() => {
    poolsStore.fetchPoolsPublicData();
  }, [poolsStore]);

  // console.log(pools);

  return (
    <>
      <main className="pools">
        <div className="row">
          <PoolsPreview />
          <ItemsController
            prefixContainer={
              <ListCardViewButtons
                view={isListView ? PoolsContentView.list : PoolsContentView.card}
                onChange={handleSwitchView}
              />
            }
            radioGroupOptions={[
              {
                text: 'Live',
                value: PoolsType.live,
              },
              {
                text: 'Finished',
                value: PoolsType.finished,
              },
            ]}
            radioGroupClassName="pools__i-contr"
            sortOptions={['Hot', 'APR', 'Earned', 'Total staked']}
            searchPlaceholder="Search Pools"
            searchDelay={300}
            onSearchChange={handleSearch}
            onStakedSwitchChange={handleStakedSwitchChange}
            onRadioGroupChange={handleRadioGroupChange}
            onSortSelectChange={handleSortSelectChange}
          />
          <PoolsContent
            view={isListView ? PoolsContentView.list : PoolsContentView.card}
            content={pools}
          />
        </div>
      </main>
      <StakeUnstakeModal />
      <CollectModal />
    </>
  );
});

export default Pools;
