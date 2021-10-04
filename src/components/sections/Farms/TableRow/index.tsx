import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import BnbImg from '@/assets/img/currency/bnb.svg';
import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import CalcImg from '@/assets/img/icons/calc.svg';
import CheckImg from '@/assets/img/icons/check.svg';
import InfoImg from '@/assets/img/icons/info.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import { Button, InputNumber, Popover } from '@/components/atoms';
import { useMst } from '@/store';

import './TableRow.scss';

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
    // TODO: FARMING ROI MODAL
    console.log(modals.roi);
    // modals.roi.open({
    //   isFarmPage: true,
    //   apr: 5,
    //   tokenPrice: 1,
    // });
  };

  const renderPopover = () => (
    <Popover
      content={
        <span className="text-med text text-purple">Total amount of NAME staked in this pool</span>
      }
      overlayInnerStyle={{ borderRadius: '20px' }}
    >
      <img src={InfoImg} alt="info" className="farms-table-row__item-img-info" />
    </Popover>
  );

  return (
    <div className="farms-table-row">
      <div
        className="farms-table-row__content"
        onClick={handleToggleDetails}
        onKeyDown={handleToggleDetails}
        role="button"
        tabIndex={0}
      >
        <div className="farms-table-row__currencies box-f-ai-c t-box-b">
          <div className="box">
            <img src={BnbImg} alt="currency" className="farms-table-row__currencies-item" />
            <img src={BnbImg} alt="currency" className="farms-table-row__currencies-item" />
          </div>
          <div className="text-upper text-smd">BTC-BNB</div>
        </div>
        <div className="farms-table-row__earned text-gray-l-2 text-smd ">
          <div className="text-gray text-ssm farms-table-row__extra-text t-box-b">Earned</div>
          <span>0</span>
        </div>
        <div className="farms-table-row__apr box-f-ai-c text-smd farms-table-row__item t-box-b">
          <div className="text-gray text-ssm farms-table-row__extra-text t-box-b">APR</div>
          <span className="farms-table-row__text-md">73.77%</span>
          <div
            className="farms-table-row__apr_button"
            onClick={handleOpenRoiModal}
            onKeyDown={handleOpenRoiModal}
            role="button"
            tabIndex={0}
          >
            <img src={CalcImg} alt="calc" />
          </div>
        </div>
        <div className="farms-table-row__liquidity box-f-ai-c text-smd farms-table-row__item t-box-none">
          <span className="farms-table-row__text text-med text-purple">$1,662,947,888</span>
          {renderPopover()}
        </div>
        <div className="farms-table-row__multiplier box-f-ai-c text-smd farms-table-row__item t-box-none">
          <span className="farms-table-row__text-md text-med text-purple">1x</span>
          {renderPopover()}
        </div>
        <div className="farms-table-row__item box-f-jc-e box-f">
          <div
            className={classNames('farms-table-row__item--mob t-box-b', {
              'farms-table-row__item--mob_active': isOpenDetails,
            })}
          >
            <img src={ArrowPurple} alt="arrow" />
          </div>
          <div className="farms-table-row__item--pc t-box-none">
            <Button
              colorScheme="outline-purple"
              size="smd"
              arrow
              toggle
              isActive={isOpenDetails}
              onToggle={handleChangeDetails}
            >
              <span>Details</span>
            </Button>
          </div>
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
        <div className="farms-table-row__details box-purple-l">
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
          <div className="farms-table-row__buttons box-f-ai-c t-box-b">
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
                start farming
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
