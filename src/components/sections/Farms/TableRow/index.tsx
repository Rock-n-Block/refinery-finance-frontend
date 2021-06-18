import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { observer } from 'mobx-react-lite';

import { Button, InputNumber, Popover } from '../../../atoms';
import { useMst } from '../../../../store';

import './TableRow.scss';

import BnbImg from '../../../../assets/img/currency/bnb.svg';
import CalcImg from '../../../../assets/img/icons/calc.svg';
import InfoImg from '../../../../assets/img/icons/info.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import CheckImg from '@/assets/img/icons/check.svg';

const TableRow: React.FC = observer(() => {
  const { user, modals } = useMst();
  const [isOpenDetails, setOpenDetails] = React.useState<boolean>(false);

  const handleChangeDetails = (value: boolean): void => {
    setOpenDetails(value);
  };

  const handleToggleDetails = (): void => {
    setOpenDetails((isOpen) => !isOpen);
  };

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
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
    <div className="farms-table-row">
      <div
        className="farms-table-row__content"
        onClick={handleToggleDetails}
        onKeyDown={handleToggleDetails}
        role="button"
        tabIndex={0}
      >
        <div className="farms-table-row__currencies box-f-ai-c">
          <img src={BnbImg} alt="currency" className="farms-table-row__currencies-item" />
          <img src={BnbImg} alt="currency" className="farms-table-row__currencies-item" />
          <div className="text-upper text-smd">BTC-BNB</div>
        </div>
        <div className="text-gray-l-2 text-smd box-f-ai-c">
          <span>0</span>
        </div>
        <div className="box-f-ai-c text-smd farms-table-row__item">
          <span className="farms-table-row__text-md">73.77%</span>
          <div
            onClick={handleOpenRoiModal}
            onKeyDown={handleOpenRoiModal}
            role="button"
            tabIndex={0}
          >
            <img src={CalcImg} alt="calc" />
          </div>
        </div>
        <div className="box-f-ai-c text-smd farms-table-row__item">
          <span className="farms-table-row__text text-med text-purple">$1,662,947,888</span>
          <Popover
            content={
              <span className="text-med text text-purple">
                Total amount of NAME staked in this pool
              </span>
            }
          >
            <img src={InfoImg} alt="info" className="farms-table-row__item-img-info" />
          </Popover>
        </div>
        <div className="box-f-ai-c text-smd farms-table-row__item">
          <span className="farms-table-row__text-md text-med text-purple">1x</span>
          <Popover
            content={
              <span className="text-med text text-purple">
                Total amount of NAME staked in this pool
              </span>
            }
          >
            <img src={InfoImg} alt="info" className="farms-table-row__item-img-info" />
          </Popover>
        </div>
        <div className="farms-table-row__item box-f-jc-e box-f">
          <Button
            colorScheme="outline-purple"
            size="smd"
            arrow
            toggle
            isActive={isOpenDetails}
            onToggle={handleChangeDetails}
          >
            <span className="text-purple text-med">Details</span>
          </Button>
        </div>
      </div>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isOpenDetails}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      >
        <div className="farms-table-row__details box-purple-l box-f-ai-c box-f-jc-sb">
          <div className="farms-table-row__details-links">
            <a
              href="/"
              className="farms-table-row__details-links-item text-ssm text-purple box-f-ai-c"
            >
              <span>Get HAKKA-BUSD LP</span>
              <img src={OpenLinkImg} alt="" />
            </a>
            <a
              href="/"
              className="farms-table-row__details-links-item text-ssm text-purple box-f-ai-c"
            >
              <span>View Contract</span>
              <img src={OpenLinkImg} alt="" />
            </a>
            <a
              href="/"
              className="farms-table-row__details-links-item text-ssm text-purple box-f-ai-c"
            >
              <span>See Pair Info</span>
              <img src={OpenLinkImg} alt="" />
            </a>
            <div className="farms-table-row__details-check box-f-ai-c">
              <img src={CheckImg} alt="" />
              <span className="text-purple text-ssmd">Core</span>
            </div>
          </div>
          <div className="box-f-ai-c">
            <div className="farms-table-row__details-box">
              <div className="farms-table-row__details-title text-purple text-ssm text-med text-upper">
                CAKE EARNED
              </div>
              <InputNumber
                colorScheme="white"
                placeholder="0.0"
                inputPrefix={
                  <Button colorScheme="purple" size="ssm">
                    <span className="text-white text-ssmd text-med">Harvest</span>
                  </Button>
                }
              />
            </div>
            <div className="farms-table-row__details-box">
              <div className="farms-table-row__details-title text-purple text-ssm text-med text-upper">
                CAKE EARNED
              </div>
              {user.address ? (
                <Button size="lg">
                  <span className="text-smd text-white text-bold">Enable</span>
                </Button>
              ) : (
                <Button size="lg">
                  <span className="text-smd text-white text-bold">Unlock Wallet</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
});

export default TableRow;
