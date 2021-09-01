import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import CalcImg from '@/assets/img/icons/calc.svg';
import InfoImg from '@/assets/img/icons/info.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import { ReactComponent as RefreshAutoIcon } from '@/assets/img/icons/refresh-auto.svg';
import RefreshImg from '@/assets/img/icons/refresh.svg';
import { Button, Popover } from '@/components/atoms';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { IToken } from '@/types';

import 'antd/lib/select/style/css';

import DropdownSelector from './DropdownSelector';

import './PoolCard.scss';

interface IAPR {
  timeframe: string;
  roi: number | string;
  rf: number | string;
}

export interface IPoolCard {
  className?: string;
  tokenEarn?: IToken;
  tokenStake: IToken;
  type: 'earn' | 'manual' | 'auto';
  apr: {
    value: number | string;
    items: IAPR[];
  };
}

interface IOpenLinkProps {
  className?: string;
  href: string;
  text: string;
}

const OpenLink: React.FC<IOpenLinkProps> = ({ className, href, text }) => {
  return (
    <a href={href} className={classNames(className, 'box-f-ai-c box-fit')}>
      <span className="text-purple text-ssm">{text}</span>
      <img src={OpenLinkImg} alt="" />
    </a>
  );
};

const mockData = {
  totalStaked: '78,790,501',
  performanceFee: 2,
};

const PoolCard: React.FC<IPoolCard> = observer(
  ({ className, tokenEarn, tokenStake, type, apr }) => {
    const { metamaskService } = useWalletConnectorContext();
    const { modals, user } = useMst();

    const [isDetailsOpen, setDetailsOpen] = useState<boolean>(false);
    const [isChooseFarmModeOpen, setChooseFarmModeOpen] = useState(false);
    const [farmMode, setFarmMode] = useState<typeof type>('manual');

    const farmModes = ['Auto', 'Manual'];

    const handleOpenChooseFarmMode = () => setChooseFarmModeOpen(true);
    const handleCloseChooseFarmMode = () => setChooseFarmModeOpen(false);

    const handleOpenArp = (): void => {
      modals.roi.open(apr.items);
    };

    return (
      <div className={classNames('p-card box-shadow', className)}>
        <div className="p-card__head box-f-ai-c box-f-jc-sb">
          <div>
            <div className="p-card__title text-slg text-purple text-bold">
              <span className="text-capitalize">{type}</span>{' '}
              {type === 'manual' && tokenEarn && (
                <span className="text-upper">{tokenEarn.name}</span>
              )}
              {type === 'auto' && <span className="text-upper">{tokenStake.name}</span>}
            </div>
            <div className="p-card__subtitle text-smd text-purple text-med">
              {type === 'manual' && tokenEarn && (
                <>
                  <span className="capitalize">Earn</span> <span>{tokenEarn.name}</span>,{' '}
                  <span>stake</span> <span className="text-upper">{tokenStake.name}</span>
                </>
              )}
              {type === 'auto' && 'Automatic restaking'}
              {type === 'earn' && `Stake ${tokenStake.name}`}
            </div>
          </div>
          <div className="p-card__icons">
            {tokenEarn && <img src={tokenEarn.logoURI} alt="" />}
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
            <span className="text-smd">{Number(apr.value).toFixed(2).replace('.', ',')}%</span>
            <img src={CalcImg} alt="calculator" />
          </div>
        </div>
        <div className="p-card__box p-card__content">
          {user.address && type === 'auto' && (
            <div className="p-card__auto">
              <div className="p-card__auto-title text-purple text-smd text-med">
                Recent {tokenStake.name} profit:
              </div>
              <div className="p-card__auto-profit text-smd text-blue-d">
                0.1% unstaking fee if withdrawn within 72h
              </div>
            </div>
          )}
          {user.address && type === 'earn' && tokenEarn && (
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
            </>
          )}
          {user.address && (
            <>
              <div className="text-purple text-med text-smd p-card__unlock-text">Start Farming</div>
              <Button className="p-card__unlock-btn">
                <span className="text-white text-smd text-bold">Enable</span>
              </Button>
            </>
          )}
          {!user.address && (
            <div className="p-card__unlock">
              <div className="text-purple text-med text-smd p-card__unlock-text">Start Earning</div>
              <Button className="p-card__unlock-btn" onClick={() => metamaskService.connect()}>
                <span className="text-white text-smd text-bold">Unlock Wallet</span>
              </Button>
            </div>
          )}
        </div>
        <div className="p-card__box p-card__footer">
          <div className="box-f-ai-c box-f-jc-sb">
            <DropdownSelector
              className="p-card__footer-dropdown"
              items={farmModes}
              open={isChooseFarmModeOpen}
              defaultValue={farmModes[1]}
              onChange={(value) => {
                setFarmMode((value as string).toLowerCase() as typeof type);
              }}
              onDropdownVisibleChange={handleCloseChooseFarmMode}
            >
              {farmMode === 'auto' && (
                <Button
                  className={classNames(
                    'p-card__footer-button',
                    'p-card__footer-button-with-icon',
                    'p-card__footer-button-with-icon_auto',
                  )}
                  size="smd"
                  colorScheme="outline-green"
                  arrow
                  onClick={handleOpenChooseFarmMode}
                >
                  <div className="box-f-c">
                    <RefreshAutoIcon />
                  </div>
                  <span className="p-card__footer-button-text text text-med text-green">
                    {farmModes[0]}
                  </span>
                </Button>
              )}
              {farmMode === 'manual' && (
                <Button
                  className={classNames('p-card__footer-button', 'p-card__footer-button-with-icon')}
                  size="smd"
                  colorScheme="outline-purple"
                  arrow
                  onClick={handleOpenChooseFarmMode}
                >
                  <img src={RefreshImg} alt="" />
                  <span className="p-card__footer-button-text text text-med text-purple">
                  {farmModes[1]}
                  </span>
                </Button>
              )}
            </DropdownSelector>

            <Popover
              content={<span className="text-med text text-purple">??????????</span>}
              overlayInnerStyle={{ borderRadius: '20px' }}
            >
              <img className="p-card__footer-info-popover" src={InfoImg} alt="" />
            </Popover>
            <Button
              toggle
              size="smd"
              colorScheme="outline-purple"
              arrow
              isActive={isDetailsOpen}
              onToggle={(value) => setDetailsOpen(value)}
            >
              <span className="text text-med text-purple">
                {isDetailsOpen ? 'Hide' : 'Details'}
              </span>
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
                  <span>{mockData.totalStaked}</span>
                  <Popover
                    content={
                      <span className="text-med text text-purple">
                        Total amount of NAME staked in this pool
                      </span>
                    }
                    overlayInnerStyle={{ borderRadius: '20px' }}
                  >
                    <img src={InfoImg} alt="" />
                  </Popover>
                </div>
              </div>
              <div className="p-card__details-item box-f-ai-c box-f-jc-sb ">
                <div className="p-card__details-item-name text-smd text-purple text-med">
                  Performance Fee:
                </div>
                <div className="p-card__details-item-value text-smd box-f-ai-c">
                  {mockData.performanceFee}%
                </div>
              </div>
              <OpenLink className="p-card__details-item" href="/" text="View Project Site" />
              <OpenLink className="p-card__details-item" href="/" text="View Contract" />
            </div>
          </CSSTransition>
        </div>
      </div>
    );
  },
);

export default PoolCard;
