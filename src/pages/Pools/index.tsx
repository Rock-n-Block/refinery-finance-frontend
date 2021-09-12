import React, { useCallback, useEffect, useState } from 'react';
import { RadioChangeEvent } from 'antd/lib/radio';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import cn from 'classnames';

import { ReactComponent as CardViewIcon } from '@/assets/img/icons/card-view.svg';
import { ReactComponent as ListViewIcon } from '@/assets/img/icons/list-view.svg';
import { Button } from '@/components/atoms';
import { ItemsController, StakeUnstakeModal } from '@/components/organisms';
import { PoolCard, PoolsPreview, PoolTable } from '@/components/sections/Pools';
import { IPoolCard } from '@/components/sections/Pools/PoolCard';

import './Pools.scss';

enum PoolsContentView {
  list = 'list',
  card = 'card',
}
interface IPoolsContent {
  view: PoolsContentView;
  content: IPoolCard[];
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
            return (
              <PoolCard
                {...pool}
                key={`${pool.tokenEarn?.address}${pool.tokenStake.address}`}
                type={pool.type}
              />
            );
          })}
      </div>
    </div>
  );
};

const pools: IPoolCard[] = [
  {
    tokenEarn: {
      name: 'WBNB Token',
      symbol: 'WBNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      chainId: 56,
      decimals: 18,
      logoURI:
        'https://tokens.pancakeswap.finance/images/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
    },
    tokenStake: {
      name: 'PancakeSwap Token',
      symbol: 'CAKE',
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      chainId: 56,
      decimals: 18,
      logoURI:
        'https://tokens.pancakeswap.finance/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
    },
    type: 'earn',
    apr: {
      value: 143.3323,
      items: [
        {
          timeframe: '1D',
          roi: 0.19,
          rf: 0.12,
        },
        {
          timeframe: '7D',
          roi: 1.43,
          rf: 0.88,
        },
      ],
    },
  },
  {
    tokenStake: {
      name: 'Cake',
      symbol: 'CAKE',
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      chainId: 56,
      decimals: 18,
      logoURI:
        'https://tokens.pancakeswap.finance/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
    },
    type: 'auto',
    apr: {
      value: 90.6,
      items: [
        {
          timeframe: '1D',
          roi: 0.19,
          rf: 0.12,
        },
        {
          timeframe: '7D',
          roi: 1.43,
          rf: 0.88,
        },
      ],
    },
  },
];

enum FilterBy {
  name = 'name',
  stakedOnly = 'stakedOnly',
  poolsType = 'poolsType',
}
type IFilterBy = keyof typeof FilterBy;
// interface IApplyFilter {
//   filterBy: IFilterBy;
//   filterFunc: (pool: IPoolCard) => boolean | typeof Array.prototype.filter;
// }
type IFilterFunc = (pool: IPoolCard) => boolean | typeof Array.prototype.filter;
// interface IApplyFilter {
//   filterFunc: (pool: IPoolCard) => boolean | typeof Array.prototype.filter;
// }

enum PoolsType {
  live = 'live',
  finished = 'finished',
}
// type IPoolsType = keyof typeof PoolsType;

enum SortOptions {
  hot = 'Hot',
  apr = 'APR',
  multiplier = 'Multiplier',
  earned = 'Earned',
  liquidity = 'Liquidity',
}

// type ISortOptions = keyof typeof SortOptions;

const Pools: React.FC = () => {
  const [filteredPools, setFilteredPools] = useState(pools);
  const [appliedFilters, setAppliedFilters] = useState<Map<IFilterBy, IFilterFunc>>(new Map());
  const [isListView, setIsListView] = useState(false);
  const [poolsTypeFilter, setPoolsTypeFilter] = useState(PoolsType.live);
  const [sortOption, setSortOption] = useState(SortOptions.hot);
  const filter = useCallback(() => {
    return [...appliedFilters.values()].reduce((acc, filterFunc) => {
      return acc.filter(filterFunc);
    }, pools);
  }, [appliedFilters]);

  const sort = useCallback(
    (array: typeof filteredPools) => {
      let sortFunc: (pool1: typeof array[0], pool2: typeof array[0]) => number;
      switch (sortOption) {
        case SortOptions.apr: {
          sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
            String(b).localeCompare(String(a));
          break;
        }
        case SortOptions.multiplier: {
          // TODO:
          sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
            String(a).localeCompare(String(b));
          break;
        }
        case SortOptions.earned: {
          // TODO:
          sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
            String(b).localeCompare(String(a));
          break;
        }
        case SortOptions.liquidity: {
          // TODO:
          sortFunc = ({ apr: { value: a } }, { apr: { value: b } }) =>
            String(b).localeCompare(String(a));
          break;
        }
        case SortOptions.hot:
        default: {
          // TODO:
          sortFunc = ({ tokenStake: { symbol: a } }, { tokenStake: { symbol: b } }) =>
            a.localeCompare(b);
          break;
        }
      }
      return [...array].sort(sortFunc);
    },
    [sortOption],
  );

  const handleSwitchView = (value: boolean) => {
    setIsListView(value);
  };

  const filterByStakedOnly = (value: number, isStaked: boolean) => {
    // TODO:
    if (isStaked) {
      return value > 100;
    }
    return true;
  };

  const filterByName = (whereToFind: string, toBeFound: string) => {
    return whereToFind.toUpperCase().startsWith(String(toBeFound).toUpperCase());
  };

  const handleStakedSwitchChange: SwitchClickEventHandler = (isStaked) => {
    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [FilterBy.stakedOnly, ({ apr }) => filterByStakedOnly(Number(apr.value), isStaked)],
      ]),
    );
  };

  const handleSearch = (value: string | number) => {
    setAppliedFilters(
      new Map([
        ...appliedFilters,
        [FilterBy.name, ({ tokenStake }) => filterByName(tokenStake.symbol, String(value))],
      ]),
    );
  };

  const handleRadioGroupChange = (e: RadioChangeEvent) => {
    setPoolsTypeFilter(e.target.value);
    console.log(poolsTypeFilter);

    setAppliedFilters(
      new Map([...appliedFilters, [FilterBy.poolsType, ({ apr }) => apr.value > 0]]),
    );
  };

  const handleSortSelectChange = (selected: any) => {
    const { value } = selected;
    setSortOption(value as SortOptions);
    console.log(value);
  };

  useEffect(() => {
    setFilteredPools(sort(filter()));
  }, [filter, sort]);

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
            searchPlaceholder="Search Pools"
            searchDelay={300}
            onSearchChange={handleSearch}
            onStakedSwitchChange={handleStakedSwitchChange}
            onRadioGroupChange={handleRadioGroupChange}
            onSortSelectChange={handleSortSelectChange}
          />
          <PoolsContent
            view={isListView ? PoolsContentView.list : PoolsContentView.card}
            content={filteredPools}
          />
        </div>
      </main>
      <StakeUnstakeModal />
    </>
  );
};

export default Pools;
