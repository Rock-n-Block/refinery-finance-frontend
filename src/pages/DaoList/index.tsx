import React from 'react';

import { DaoPreview, DaoWrapper } from '@/components/sections/Dao';
import { DaoListItemsList } from '@/components/sections/DaoList';

import './DaoList.scss';

const mockData = {
  items: [
    {
      id: '1',
      title: 'DeFi Education Fund',
      status: 'active',
    },
    {
      id: '2',
      title: 'Reduce the UNI proposal submission threshold to 2.5M',
      status: 'active',
    },
    {
      id: '3',
      title: 'Refinery Finance Grants Program v0.1',
      status: 'active',
    },
    {
      id: '4',
      title: 'Retroactive Proxy Contract Airdrop — Phase One',
      status: 'active',
    },
    {
      id: '5',
      title: 'Reduce UNI Governance Proposal & Quorum Thresholds',
      status: 'closed',
    },
    {
      id: '6',
      title: 'Reduce UNI Governance Proposal & Quorum Thresholds',
      status: 'closed',
    },
  ],
};

const DaoList: React.FC = () => {
  const { items } = mockData;
  return (
    <DaoWrapper>
      <DaoPreview />
      <div className="dao-list__list-wrapper">
        <DaoListItemsList items={items} />
      </div>
    </DaoWrapper>
  );
};
export default DaoList;
