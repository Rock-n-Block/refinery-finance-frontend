import React from 'react';

import { IToken } from '../../../../types';

import './PoolCard.scss';

import CalcImg from '../../../../assets/img/icons/calc.svg';

interface IPoolCard {
  tokenEarn: IToken;
  tokenStake: IToken;
  type: 'earn' | 'manual' | 'auto';
  apr: number | string;
}

const PoolCard: React.FC<IPoolCard> = ({ tokenEarn, tokenStake, type, apr }) => {
  return (
    <div className="p-card box-shadow">
      <div className="p-card__head box-f-ai-c box-f-jc-sb">
        <div>
          <div className="p-card__title text-slg text-purple text-bold">
            <span className="text-capitalize">{type}</span>{' '}
            <span className="text-upper">{tokenEarn.name}</span>
          </div>
          <div className="p-card__subtitle text-smd text-purple text-med">
            {type === 'manual' ? (
              <>
                <span className="capitalize">Earn</span> <span>{tokenEarn.name}</span>,{' '}
                <span>stake</span> <span className="text-upper">{tokenStake.name}</span>
              </>
            ) : (
              ''
            )}
            {type === 'auto' ? 'Automatic restaking' : ''}
            {type === 'earn' ? `Stake ${tokenStake.name}` : ''}
          </div>
        </div>
        <div className="p-card__icons">
          <img src={tokenEarn.logoURI} alt="" />
          <img src={tokenStake.logoURI} alt="" />
        </div>
      </div>
      <div className="p-card__arp box-f-ai-c box-f-jc-sb">
        <span className="text-smd text-purple text-med text-upper">
          {type === 'auto' ? 'apy' : 'arp'}
        </span>
        <div className="p-card__arp-percent">
          <span className="text-smd">{apr}%</span>
          <img src={CalcImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
