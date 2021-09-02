import React from 'react';
import classNames from 'classnames';

import TimerImg from '@/assets/img/icons/timer.svg';

import { IColumn } from '../types';

interface IEndsInColumnProps extends IColumn {
  value: string;
}

const EndsIn: React.FC<IEndsInColumnProps> = ({ value, onlyDesktop }) => {
  return (
    <div
      className={classNames(
        'pools-table-row__ends-in',
        'pools-table-row__item',
        'box-f-ai-c',
        'text-smd',
        {
          't-box-none': onlyDesktop,
        },
      )}
    >
      <div className="pools-table-row__text-md">
        <div>{value}</div> <div>blocks</div>
      </div>
      <div className="box">
        <img src={TimerImg} alt="timer" className="pools-table-row__item-img-info" />
      </div>
    </div>
  );
};

export default EndsIn;
