import React from 'react';

import { FarmsPreview, FarmsTable } from '../../components/sections/Farms';
import { ItemsController } from '../../components/organisms';

import './Farms.scss';

const Farms: React.FC = () => {
  return (
    <main className="farms">
      <div className="row">
        <FarmsPreview />
        <ItemsController />
        <FarmsTable />
      </div>
    </main>
  );
};

export default Farms;
