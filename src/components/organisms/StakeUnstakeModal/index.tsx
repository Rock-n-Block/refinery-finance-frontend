import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, InputNumber, Slider } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { useMst } from '@/store';

import './StakeUnstakeModal.scss';

// interface IStakeUnstakeModal {
//   isVisible?: boolean;
//   handleClose: () => void;
// }

const mockData = {
  additionalCurrency: 'USD',
};

const MAX_PERCENTAGE = 100;
const percentBoundariesButtons = [
  {
    value: 25,
    name: '25%',
  },
  {
    value: 50,
    name: '50%',
  },
  {
    value: 75,
    name: '75%',
  },
  {
    value: MAX_PERCENTAGE,
    name: 'Max',
  },
];
const USD_TOKEN_PRICE = 27;

const StakeUnstakeModal: React.FC = observer(() => {
  const [balance, setBalance] = useState(0);
  const [isBalanceFetched, setIsBalanceFetched] = useState(false);
  const [percent, setPercent] = useState(25);
  const [valueToStake, setValueToStake] = useState(0);

  const { modals } = useMst();

  // TODO: refactor this
  const calculateValueByPercent = useCallback(
    (newPercentValue: number) => (balance * newPercentValue) / MAX_PERCENTAGE,
    [balance],
  );
  const calculatePercentByValue = (newValue: number) => (MAX_PERCENTAGE * newValue) / balance;

  const updateValueByPercent = useCallback(
    (newPercent: number) => {
      setValueToStake(calculateValueByPercent(newPercent));
    },
    [calculateValueByPercent],
  );
  const updatePercentByValue = (newValue: number) => {
    setPercent(calculatePercentByValue(newValue));
  };

  const handleValueChange = (newValue: any) => {
    setValueToStake(newValue);
    updatePercentByValue(newValue);
  };

  const handlePercentChange = (newPercentValue: number) => {
    setPercent(newPercentValue);
    updateValueByPercent(newPercentValue);
  };

  const handleConfirm = () => {
    // TODO: remove this MOCK code
    console.log(modals.stakeUnstake.stakedValue, valueToStake);
    if (modals.stakeUnstake.isStaking) {
      const isGreaterThanUserBalance = valueToStake > balance;
      modals.stakeUnstake.stake(isGreaterThanUserBalance ? balance : valueToStake);
    } else {
      const isGreaterThanUserStaked = valueToStake > modals.stakeUnstake.stakedValue;
      modals.stakeUnstake.unstake(
        isGreaterThanUserStaked ? modals.stakeUnstake.stakedValue : valueToStake,
      );
    }
    modals.stakeUnstake.close();
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setBalance(5);
      setIsBalanceFetched(true);
    }, 5000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    updateValueByPercent(percent);
  }, [percent, updateValueByPercent]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setBalance(3);
  //   }, 10000);
  // }, []);

  const usdValueToStake = useMemo(() => valueToStake * USD_TOKEN_PRICE, [valueToStake]);

  useEffect(() => {
    // for any 'location' changes with opened modal
    return () => {
      modals.stakeUnstake.close();
    };
  }, [modals.stakeUnstake]);

  return (
    <Modal
      isVisible={modals.stakeUnstake.isOpen}
      className="stake-unstake-modal"
      handleCancel={modals.stakeUnstake.close}
      width={390}
      closeIcon
    >
      <div className="stake-unstake-modal__content">
        <div className="stake-unstake-modal__title text-smd text-bold text-purple">
          {modals.stakeUnstake.isStaking ? 'Stake in Pool' : 'Unstake'}
        </div>
        <div className="stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-purple text-med text">
            {modals.stakeUnstake.isStaking ? 'Stake' : 'Unstake'}
          </span>
          <div className="box-f-ai-c stake-unstake-modal__currency text-smd text-purple">
            <img src={UnknownImg} alt="" />
            <span>BNB</span>
          </div>
        </div>
        <InputNumber
          className="stake-unstake-modal__input"
          value={valueToStake}
          colorScheme="outline"
          inputSize="md"
          inputPrefix={
            <span className="text-ssm text-gray">
              ~{usdValueToStake} {mockData.additionalCurrency}
            </span>
          }
          prefixPosition="button"
          min={0}
          max={balance}
          readOnly={!isBalanceFetched}
          onChange={handleValueChange}
        />
        <div className="stake-unstake-modal__balance text-right">Balance: {balance}</div>
        <Slider value={percent} onChange={handlePercentChange} />
        <div className="box-f-ai-c box-f-jc-sb stake-unstake-modal__btns">
          {percentBoundariesButtons.map(({ value, name = value }) => (
            <Button
              colorScheme="purple-l"
              size="smd"
              key={name}
              onClick={() => handlePercentChange(value)}
            >
              <span className="text-ssmd text-med">{name}</span>
            </Button>
          ))}
        </div>
        <Button className="stake-unstake-modal__btn" onClick={handleConfirm}>
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
        {modals.stakeUnstake.isStaking && (
          <Button
            className="stake-unstake-modal__btn stake-unstake-modal__btn-get-currency"
            colorScheme="outline-purple"
            link="/trade/swap"
          >
            <span className="text-bold text-smd">Get CAKE</span>
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default StakeUnstakeModal;
