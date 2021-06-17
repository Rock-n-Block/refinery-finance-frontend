import React from 'react';

import { Switch } from '../../atoms';

import './ItemsController.scss';

const ItemsController: React.FC = React.memo(() => {
  return (
    <div className="i-contr box-f-ai-c box-f-jc-sb">
      <div className="box-f-ai-c">
        <Switch
          colorScheme="white"
          text={<span className="text-purple text-bold">Staked only</span>}
        />
      </div>
    </div>
  );
});

export default ItemsController;
