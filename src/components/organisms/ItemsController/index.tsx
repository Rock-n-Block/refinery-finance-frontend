import React from 'react';
import cn from 'classnames';

import { RadioGroup, Search, SortSelect, Switch } from '@/components/atoms';

import './ItemsController.scss';

interface IItemsController {
  prefixContainer?: React.ReactFragment;
  radioGroupOptions?: Array<{ text: string; value: string }>;
  radioGroupClassName?: string;
}

const ItemsController: React.FC<IItemsController> = React.memo(
  ({
    prefixContainer,
    radioGroupOptions = [
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
    ],
    radioGroupClassName,
  }) => {
    return (
      <div className="i-contr box-f-ai-c box-f-jc-sb t-box-b">
        <div className="box-f-ai-c t-box-b">
          {prefixContainer && prefixContainer}
          <Switch
            colorScheme="white"
            text={<span className="i-contr__switch-text text-purple text-bold">Staked only</span>}
          />
          <RadioGroup
            className={cn('i-contr__radio', radioGroupClassName)}
            buttonClassName="i-contr__button"
            buttonStyle="solid"
            defaultValue="live"
            items={radioGroupOptions}
          />
        </div>
        <div className="box-f-ai-c">
          <SortSelect className="i-contr__sort" label="Sort by " />
          <Search className="i-contr__search" colorScheme="gray" placeholder="Search Farms" />
        </div>
      </div>
    );
  },
);

export default ItemsController;
