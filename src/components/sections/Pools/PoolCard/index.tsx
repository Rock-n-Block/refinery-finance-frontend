import React from 'react';
import { observer } from 'mobx-react-lite';

import { IToken } from '../../../../types';
import { useMst } from '../../../../store';
import { Button } from '../../../atoms';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';

import './PoolCard.scss';

import CalcImg from '../../../../assets/img/icons/calc.svg';

interface IPoolCard {
  tokenEarn: IToken;
  tokenStake: IToken;
  type: 'earn' | 'manual' | 'auto';
  apr: number | string;
}

const PoolCard: React.FC<IPoolCard> = observer(({ tokenEarn, tokenStake, type, apr }) => {
  const { metamaskService } = useWalletConnectorContext();
  const { modals, user } = useMst();

  const handleOpenArp = (): void => {
    modals.roi.open([
      {
        timeframe: '1D',
        roi: 0.19,
        rf: 0.12,
      },
      {
        timeframe: '1D',
        roi: 0.19,
        rf: 0.12,
      },
    ]);
  };

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
      <div className="p-card__arp p-card__box box-f-ai-c box-f-jc-sb">
        <span className="text-smd text-purple text-med text-upper">
          {type === 'auto' ? 'apy' : 'arp'}
        </span>
        <div
          className="p-card__arp-percent box-pointer"
          onClick={handleOpenArp}
          onKeyDown={handleOpenArp}
          role="button"
          tabIndex={0}
        >
          <span className="text-smd">{apr}%</span>
          <img src={CalcImg} alt="" />
        </div>
      </div>
      <div className="p-card__box p-card__content">
        {user.address ? <div className="p-card__earned">1</div> : ''}
        {!user.address ? (
          <div className="p-card__unlock">
            <div className="text-purple text-med text-smd p-card__unlock-text">Start Earning</div>
            <Button className="p-card__unlock-btn" onClick={metamaskService.connect}>
              <span className="text-white text-smd text-bold">Unlock Wallet</span>
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
});

export default PoolCard;
