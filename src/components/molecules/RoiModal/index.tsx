import React from 'react';
import { observer } from 'mobx-react-lite';

import OpenLinkImg from '@/assets/img/icons/open-link.svg';

import { useMst } from '../../../store';
import { Modal } from '..';

import './RoiModal.scss';

const RoiModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = () => {
    modals.roi.close();
  };
  return (
    <Modal isVisible={modals.roi.isOpen} className="m-roi" handleCancel={handleClose} closeIcon>
      <div className="m-roi__content">
        <div className="m-roi__title text-md text-med text-purple text-upper">roi</div>
        <div className="m-roi__table">
          <div className="m-roi__table-row text-purple text-bold text-upper">
            <div>timeframe</div>
            <div>roi</div>
            <div>RF PER $1,000</div>
          </div>
          {modals.roi.items.map((item) => (
            <div key={item.timeframe} className="m-roi__table-row text-smd">
              <div>{item.timeframe}</div>
              <div>{item.roi}%</div>
              <div>{item.rf}</div>
            </div>
          ))}
        </div>
        <div className="m-roi__text text-gray text-ssm">
          <p>
            Calculated based on current rates. Compounding 288x daily. Rates are estimates provided
            for your convenience only, and by no means represent guaranteed returns.
          </p>
          <p>All estimated rates take into account this pool’s 2% performance fee</p>
        </div>
        <a href="/" className="m-roi__link box-f-ai-c">
          <div className="text-purple text-smd">Get CAKE</div>
          <img src={OpenLinkImg} alt="" />
        </a>
      </div>
    </Modal>
  );
});

export default RoiModal;
