import React from 'react';
import classNames from 'classnames';

import { IColumn } from '../types';

interface ITotalStakedColumnProps extends IColumn {
  value: string;
}

const TotalStaked: React.FC<ITotalStakedColumnProps> = ({ value, onlyDesktop = false }) => {
  return (
    <div
      className={classNames(
        'pools-table-row__total-staked',
        'pools-table-row__item',
        'box-f-ai-c',
        'text-smd',
        {
          't-box-none': onlyDesktop,
        },
      )}
    >
      <span className="text-med text-purple">${value}</span>
    </div>
  );
};

export default TotalStaked;
