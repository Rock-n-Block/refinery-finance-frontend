import React from 'react';

import { ItemsController } from '@/components/organisms';
import { FarmsPreview, FarmsTable } from '@/components/sections/Farms';

import './Farms.scss';

const Farms: React.FC = () => {
  return (
    <main className="farms">
      <div className="row">
        <FarmsPreview />
        <ItemsController radioGroupClassName="farms__i-contr" />
        <FarmsTable />
      </div>
    </main>
  );
};

export default Farms;
