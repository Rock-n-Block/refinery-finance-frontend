import React from 'react';

import { Modal } from '../../molecules';
import { InputNumber, Slider, Button } from '../../atoms';

import './StakeUnstakeModal.scss';

import UnknownImg from '@/assets/img/currency/unknown.svg';

interface IStakeUnstakeModal {
  isVisible?: boolean;
  handleClose: () => void;
}

const StakeUnstakeModal: React.FC<IStakeUnstakeModal> = ({ isVisible, handleClose }) => {
  const [percent, setPercent] = React.useState<number>(25);

  const btns = [25, 50, 75];

  const handlePercentChange = (value: number) => {
    setPercent(value);
  };

  return (
    <Modal
      isVisible={!!isVisible}
      className="stake-unstake-modal"
      handleCancel={handleClose}
      width={390}
      closeIcon
    >
      <div className="stake-unstake-modal__content">
        <div className="stake-unstake-modal__title text-smd text-bold text-purple">
          Stake in Pool
        </div>
        <div className="stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-purple text-med text">Stake</span>
          <div className="box-f-ai-c stake-unstake-modal__currency text-smd text-purple">
            <img src={UnknownImg} alt="" />
            <span>BNB</span>
          </div>
        </div>
        <InputNumber
          colorScheme="outline"
          inputSize="md"
          className="stake-unstake-modal__input"
          inputPrefix={<span className="text-ssm text-gray">~22.37 USD</span>}
          prefixPosition="button"
        />
        <div className="stake-unstake-modal__balance text-right">Balance: 2</div>
        <Slider value={percent} onChange={handlePercentChange} />
        <div className="box-f-ai-c box-f-jc-sb stake-unstake-modal__btns">
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
        <Button className="stake-unstake-modal__btn">
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
        <Button
          className="stake-unstake-modal__btn"
          colorScheme="outline-purple"
          link="/trade/swap"
        >
          <span className="text-bold text-smd">Get CAKE</span>
        </Button>
      </div>
    </Modal>
  );
};

export default StakeUnstakeModal;
