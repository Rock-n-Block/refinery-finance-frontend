import React from 'react';
import { observer } from 'mobx-react-lite';

import { ItemsController } from '@/components/organisms';
import { FarmsPreview, FarmsTable } from '@/components/sections/Farms';
import { useFarms } from '@/store/farms/hooks';
import { Farm } from '@/types';

import './Farms.scss';

interface IFarmsContent {
  content: Farm[];
}

const FarmsContent: React.FC<IFarmsContent> = ({ content }) => {
  return (
    <div className="farms__content">
      <FarmsTable data={content} />
    </div>
  );
};

const Farms: React.FC = observer(() => {
  // const { farms: farmsStore } = useMst();
  const { farms: rawFarms } = useFarms();
  const [, ...farmsWithoutFirstLpFarm] = rawFarms;
  const farms = farmsWithoutFirstLpFarm;
  return (
    <main className="farms">
      <div className="row">
        <FarmsPreview />
        <ItemsController radioGroupClassName="farms__i-contr" searchPlaceholder="Search Farms" />
        <FarmsContent content={farms} />
      </div>
    </main>
  );
});

export default Farms;
