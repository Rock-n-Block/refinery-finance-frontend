import React from 'react';

import { TradeBox } from '..';
import { Button } from '../../../atoms';

import './Receive.scss';

import BnbImg from '@/assets/img/currency/bnb.svg';

const Receive: React.FC = () => {
  return (
    <TradeBox className="receive" title="You will receive" titleBackLink>
      <div className="receive__box">
        <div className="receive__item box-f-ai-c box-f-jc-sb">
          <div className="text-lmd">0.954045</div>
          <div className="receive__item-currency box-f-ai-c">
            <div className="text-upper text-smd">BNB</div>
            <img src={BnbImg} alt="" />
          </div>
        </div>
        <div className="text-purple text-lmd text-med receive__plus">+</div>
        <div className="receive__item box-f-ai-c box-f-jc-sb">
          <div className="text-lmd">0.954045</div>
          <div className="receive__item-currency box-f-ai-c">
            <div className="text-upper text-smd">BNB</div>
            <img src={BnbImg} alt="" />
          </div>
        </div>
      </div>
      <div className="text text-gray">
        Output is stimulated. If the price changes by more than 0.8% your transaction will revert.
      </div>
      <div className="receive__burned box-f-ai-c box-f-jc-sb text-smd text-purple">
        <span>LP CAKE/BNB Burned</span>
        <div className="box-f-ai-c">
          <img src={BnbImg} alt="" />
          <img src={BnbImg} alt="" />
          <span>0.343535</span>
        </div>
      </div>
      <div className="receive__price box-f box-f-jc-sb text-smd text-purple">
        <span>Price</span>
        <div>
          <div className="peceive__price-item">1 CAKE = 0.335252 BNB</div>
          <div className="peceive__price-item">1 CAKE = 0.335252 BNB</div>
        </div>
      </div>
      <Button className="receive__btn">
        <span className="text-white text-bold text-md">Confirm</span>
      </Button>
    </TradeBox>
  );
};

export default Receive;
