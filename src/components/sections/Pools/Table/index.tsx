import React from 'react';
import classNames from 'classnames';

import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';

// import { IPoolCard } from '@/components/sections/Pools/PoolCard';
import { PoolTableRow } from '..';

import './Table.scss';

enum ColumnStyle {
  default = 'default',
  disabled = 'disabled',
}

type IColumnStyle = keyof typeof ColumnStyle;

interface ITableProps {
  data: Pool[];
}

interface IColumn {
  style?: IColumnStyle;
  name: string;
}

const columns: IColumn[] = [
  {
    style: 'disabled',
    name: `Recent CAKE profit`,
  },
  {
    name: 'APR',
  },
  {
    name: 'Total staked',
  },
  {
    name: 'Ends in',
  },
];

const Table: React.FC<ITableProps> = React.memo(({ data }) => {
  return (
    <div className="pools-table box-shadow box-white box-overflow-v">
      <div className="pools-table__head t-box-none">
        <div />
        {columns.map(({ name, style = 'default' }) => (
          <div
            key={name}
            className={classNames({
              'text-ssm text-gray-l-2': style === ColumnStyle.disabled,
              'text-bold text-purple': style === ColumnStyle.default,
            })}
          >
            {name}
          </div>
        ))}
      </div>
      {data.map((pool) => {
        let farmMode: IPoolFarmingMode;
        if (pool.isAutoVault) {
          farmMode = PoolFarmingMode.auto;
        } else if (pool.id === 0) {
          farmMode = PoolFarmingMode.manual;
        } else {
          farmMode = PoolFarmingMode.earn;
        }
        return (
          <PoolTableRow
            // key={`${rowData.tokenEarn?.address}${rowData.tokenStake.address}`}
            key={pool.isAutoVault ? 'auto-pool' : pool.id}
            farmMode={farmMode}
            pool={pool}
            columns={columns}
          />
        );
      })}
    </div>
  );
});

export default Table;
