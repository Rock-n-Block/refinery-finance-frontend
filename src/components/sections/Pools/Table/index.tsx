import React from 'react';
import classNames from 'classnames';

import { IPoolCard } from '@/components/sections/Pools/PoolCard';

import { PoolTableRow } from '..';

import './Table.scss';

enum ColumnStyle {
  default = 'default',
  disabled = 'disabled',
}

type IColumnStyle = keyof typeof ColumnStyle;

interface ITableProps {
  data: IPoolCard[];
}

const Table: React.FC<ITableProps> = React.memo(({ data }) => {
  const columns: Array<{ style?: IColumnStyle; name: string }> = [
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

  return (
    <div className="pools-table box-shadow box-white box-overflow-v">
      <div className="pools-table__head t-box-none">
        <div />
        {/* <div className="text-ssm text-gray-l-2">Earned</div> */}
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
        {/* <div className="text-bold text-purple">APR</div>
        <div className="text-bold text-purple">Liquidity</div>
        <div className="text-bold text-purple">Multiplier</div> */}
      </div>
      <PoolTableRow data={data[0]} columns={columns} />
      <PoolTableRow data={data[1]} columns={columns} />
      {/* <PoolTableRow /> */}
    </div>
  );
});

export default Table;
