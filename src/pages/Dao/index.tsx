import React from 'react';

// import { Link } from 'react-router-dom';
// import classNames from 'classnames';
import './Dao.scss';

// import Button from '@/components/atoms/Button';
import { DaoList, DaoPreview } from '@/components/sections/Dao';

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

const Dao: React.FC = () => {
  const { items } = mockData;
  return (
    <main className="dao">
      <div className="row">
        <div className="dao__content">
          <DaoPreview />
          <div className="dao__list-wrapper">
            <DaoList items={items} />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Dao;
