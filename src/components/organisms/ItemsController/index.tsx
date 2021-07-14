import React from 'react';

import { Switch, RadioGroup, Search, SortSelect } from '../../atoms';

import './ItemsController.scss';

const ItemsController: React.FC = React.memo(() => {
  return (
    <div className="i-contr box-f-ai-c box-f-jc-sb">
      <div className="box-f-ai-c i-contr_box--1">
        <Switch
          colorScheme="white"
          text={<span className="text-purple text-bold">Staked only</span>}
        />
        <RadioGroup
          className="i-contr__radio"
          buttonStyle="solid"
          defaultValue="live"
          items={[
            {
              text: 'Live',
              value: 'live',
            },
            {
              text: 'Finished',
              value: 'finished',
            },
            {
              text: 'Discontinued',
              value: 'discontinued',
            },
          ]}
        />
      </div>
      <div className="box-f-ai-c">
        <SortSelect label="Sort by " />
        <Search colorScheme="gray" placeholder="Search Farms" className="i-contr__search" />
      </div>
    </div>
  );
});

export default ItemsController;
