import React from 'react';

import { FarmsTableRow } from '..';

import './Table.scss';

const Table: React.FC = React.memo(() => {
  return (
    <div className="farms-table box-shadow box-white box-overflow-v">
      <div className="farms-table__head">
        <div />
        <div className="text-ssm text-gray-l-2">Earned</div>
        <div className="text-bold text-purple">APR</div>
        <div className="text-bold text-purple">Liquidity</div>
        <div className="text-bold text-purple">Multiplier</div>
      </div>
      <FarmsTableRow />
      <FarmsTableRow />
      <FarmsTableRow />
    </div>
  );
});

export default Table;
