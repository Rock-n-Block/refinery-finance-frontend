import React from 'react';

import { Button } from '../../../atoms';

import './Preview.scss';

import AucImg from '../../../../assets/img/sections/farms/auc.svg';

const Preview: React.FC = React.memo(() => {
  return (
    <div className="farms-preview box-purple-l">
      <div className="farms-preview__box">
        <h1 className="farms-preview__title h1 text-white text-bold">Farms</h1>
        <div className="farms-preview__subtitle text-white">
          Stake Liquidity Pool (LP) tokens to earn.
        </div>
      </div>
      <div className="farms-preview__auc box-f-ai-c box-f-jc-sb">
        <div className="box-f-ai-c">
          <img src={AucImg} alt="auction" className="farms-preview__auc-img" />
          <span className="text-upper text-bold text-purple">
            ACTION REQUIRED for all LP token holders
          </span>
        </div>
        <Button colorScheme="outline-purple" size="smd" arrow toggle>
          <span className="text-purple text-med">Details</span>
        </Button>
      </div>
    </div>
  );
});

export default Preview;
