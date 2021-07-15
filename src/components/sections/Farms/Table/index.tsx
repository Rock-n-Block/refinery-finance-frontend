import React from 'react';

import { FarmsTableRow } from '..';

import './Table.scss';

const Table: React.FC = React.memo(() => {
  return (
    <div className="farms-table box-shadow box-white box-overflow-v">
      <div className="farms-table__head t-box-none">
        <div />
        <div className="text-ssm text-gray-l-2">Earned</div>
        <div className="text-bold text-purple farms-table--apr">APR</div>
        <div className="text-bold text-purple farms-table--liquidity">Liquidity</div>
        <div className="text-bold text-purple farms-table--multiplier">Multiplier</div>
      </div>
      <FarmsTableRow />
      <FarmsTableRow />
      <FarmsTableRow />
    </div>
  );
});

export default Table;
