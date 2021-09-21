import React from 'react';

import InfoImg from '@/assets/img/icons/info.svg';
import BgImg from '@/assets/img/sections/pools/bg-2.svg';
import { Button, Popover } from '@/components/atoms';

import './Preview.scss';

const mockData = {
  cake: '0.002',
  cakeUsd: '0.10',
};

const Preview: React.FC = () => {
  const { cake, cakeUsd } = mockData;
  return (
    <div className="pools-preview box-f-ai-c box-f-jc-sb">
      <img src={BgImg} alt="" className="pools-preview__bg" />
      <div className="pools-preview__box">
        <h1 className="pools-preview__title h1-lg text-white text-bold">Rocket Pools</h1>
        <div className="pools-preview__subtitle text-white">
          Simply stake tokens to earn. <br />
          High APR, low risk.
        </div>
      </div>
      <div className="pools-preview__bounty box-white box-shadow">
        <div className="pools-preview__bounty-title box-f-ai-c">
          <span className="text-upper text-med text-ssm text-purple">Auto CAKE Bounty</span>
          <Popover
            content={<span className="text-med text text-purple">??????????</span>}
            overlayInnerStyle={{ borderRadius: '20px' }}
          >
            <img src={InfoImg} alt="" />
          </Popover>
        </div>
        <div className="pools-preview__bounty-box box-f-ai-c box-f-jc-sb">
          <div>
            <div className="text-lg">{cake}</div>
            <div className="pools-preview__bounty-usd text-med text-gray">~ {cakeUsd} USD</div>
          </div>
          <Button className="pools-preview__bounty-btn">
            <span className="text-white text-smd text-bold">Claim</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
