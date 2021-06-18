import React from 'react';

import { PoolsPreview } from '../../components/sections/Pools';
import { ItemsController } from '../../components/organisms';

import './Pools.scss';

const Pools: React.FC = () => {
  return (
    <main className="pools">
      <div className="row">
        <PoolsPreview />
        <ItemsController />
      </div>
    </main>
  );
};

export default Pools;
