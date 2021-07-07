import React from 'react';

import { TradeBox } from '..';
import { Slider, Button } from '../../../atoms';

import './RemoveLiquidity.scss';

import BnbImg from '@/assets/img/currency/bnb.svg';

const RemoveLiquidity: React.FC = () => {
  const [percent, setPercent] = React.useState<number>(25);

  const btns = [25, 50, 75];

  const handlePercentChange = (value: number) => {
    setPercent(value);
  };

  return (
    <TradeBox className="r-liquidity" title="Remove Liguidity" titleBackLink>
      <div className="r-liquidity__percent text-purple">{percent}%</div>
      <Slider
        tooltipVisible={false}
        onChange={handlePercentChange}
        defaultValue={25}
        value={percent}
        min={25}
      />
      <div className="r-liquidity__percent-btns box-f-ai-c box-f-jc-sb">
        {btns.map((btn) => (
          <Button
            colorScheme="purple-l"
            size="smd"
            key={btn}
            onClick={() => handlePercentChange(btn)}
          >
            <span className="text-ssmd text-med">{btn}%</span>
          </Button>
        ))}
        <Button colorScheme="purple-l" size="smd" onClick={() => handlePercentChange(100)}>
          <span className="text-ssmd text-med">Max</span>
        </Button>
      </div>
      <div className="r-liquidity__content">
        <div className="r-liquidity__currency box-f-ai-c box-f-jc-sb">
          <div className="r-liquidity__currency-sum text-lmd">0.954045</div>
          <div className="box-f-ai-c r-liquidity__currency-item">
            <div className="text-smd text-upper">bnb</div>
            <img src={BnbImg} alt="" />
          </div>
        </div>
        <div className="r-liquidity__currency box-f-ai-c box-f-jc-sb">
          <div className="r-liquidity__currency-sum text-lmd">0.954045</div>
          <div className="box-f-ai-c r-liquidity__currency-item">
            <div className="text-smd text-upper">bnb</div>
            <img src={BnbImg} alt="" />
          </div>
        </div>
      </div>
      <div className="r-liquidity__price box-f box-f-jc-sb text-purple">
        <span>Price</span>
        <div>
          <div className="r-liquidity__price-item text-right">1 CAKE = 390359305 BNB</div>
          <div className="r-liquidity__price-item text-right">1 BNB = 1415.35 CAKE</div>
        </div>
      </div>
      <div className="r-liquidity__btns box-f-ai-c box-f-jc-sb">
        <Button>
          <span className="text-white text-bold text-md">Approve</span>
        </Button>
        <Button disabled>
          <span className="text-white text-bold text-md">Remove</span>
        </Button>
      </div>
    </TradeBox>
  );
};

export default RemoveLiquidity;
