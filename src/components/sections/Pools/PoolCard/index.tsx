import React from 'react';
import { observer } from 'mobx-react-lite';
import { CSSTransition } from 'react-transition-group';

import { IToken } from '../../../../types';
import { useMst } from '../../../../store';
import { Button, Popover } from '../../../atoms';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';

import './PoolCard.scss';

import CalcImg from '@/assets/img/icons/calc.svg';
import RefreshImg from '@/assets/img/icons/refresh.svg';
import InfoImg from '@/assets/img/icons/info.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';

interface IPoolCard {
  tokenEarn: IToken;
  tokenStake: IToken;
  type: 'earn' | 'manual' | 'auto';
  apr: number | string;
}

const PoolCard: React.FC<IPoolCard> = observer(({ tokenEarn, tokenStake, type, apr }) => {
  const { metamaskService } = useWalletConnectorContext();
  const { modals, user } = useMst();

  const [isDetailsOpen, setDetailsOpen] = React.useState<boolean>(false);

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
        {user.address ? (
          <>
            <div className="p-card__earned box-f box-f-jc-sb">
              <div>
                <div className="text-smd text-purple text-med">{tokenEarn.name} Earned</div>
                <div className="p-card__earned-numb text-blue-d text-smd">0</div>
                <div className="text-gray text-smd">~ 0 USD</div>
              </div>
              <Button colorScheme="purple" size="smd">
                <span className="text-white text">Collect</span>
              </Button>
            </div>
            <div className="text-purple text-med text-smd p-card__unlock-text">Start Farming</div>
            <Button className="p-card__unlock-btn">
              <span className="text-white text-smd text-bold">Enable</span>
            </Button>
          </>
        ) : (
          ''
        )}
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
      <div className="p-card__box">
        <div className="box-f-ai-c box-f-jc-sb">
          <Button size="smd" colorScheme="outline-purple" noclick>
            <img src={RefreshImg} alt="" />
            <span className="text text-med text-purple">Manual</span>
          </Button>
          <Button
            toggle
            size="smd"
            colorScheme="outline-purple"
            arrow
            isActive={isDetailsOpen}
            onToggle={(value) => setDetailsOpen(value)}
          >
            <span className="text text-med text-purple">Details</span>
          </Button>
        </div>
        <CSSTransition
          unmountOnExit
          mountOnEnter
          in={isDetailsOpen}
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          classNames="show"
        >
          <div className="p-card__details">
            <div className="p-card__details-item box-f-ai-c box-f-jc-sb ">
              <div className="p-card__details-item-name text-smd text-purple text-med">
                Total staked:
              </div>
              <div className="p-card__details-item-value text-smd box-f-ai-c">
                <span>78,790,501</span>
                <Popover
                  content={
                    <span className="text-med text text-purple">
                      Total amount of NAME staked in this pool
                    </span>
                  }
                >
                  <img src={InfoImg} alt="" />
                </Popover>
              </div>
            </div>
            <div className="p-card__details-item box-f-ai-c box-f-jc-sb ">
              <div className="p-card__details-item-name text-smd text-purple text-med">
                Performance Fee:
              </div>
              <div className="p-card__details-item-value text-smd box-f-ai-c">2%</div>
            </div>
            <a href="/" className="p-card__details-item box-f-ai-c box-fit">
              <span className="text-purple text-ssm">View Project Site</span>
              <img src={OpenLinkImg} alt="" />
            </a>
            <a href="/" className="p-card__details-item box-f-ai-c box-fit">
              <span className="text-purple text-ssm">View Contract</span>
              <img src={OpenLinkImg} alt="" />
            </a>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
});

export default PoolCard;
