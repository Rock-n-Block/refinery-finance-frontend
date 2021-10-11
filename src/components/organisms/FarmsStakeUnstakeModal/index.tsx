import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { Button, InputNumber, Slider } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { Modal } from '@/components/molecules';
import useStakeFarms from '@/hooks/farms/useStakeFarms';
import useUnstakeFarms from '@/hooks/farms/useUnstakeFarms';
import { useMst } from '@/store';
import { getBalanceAmount, getFullDisplayBalance } from '@/utils/formatters';
import { clog, clogError } from '@/utils/logger';

import './FarmsStakeUnstakeModal.scss';

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

const FarmsStakeUnstakeModal: React.FC = observer(() => {
  // const [isBalanceFetched, setIsBalanceFetched] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const [percent, setPercent] = useState(MAX_PERCENTAGE / 4);
  const [valueToStake, setValueToStake] = useState(0);

  const { modals, farms: farmsStore, user } = useMst();
  const modal = modals.farmsStakeUnstake;
  const tokenUsdPrice = modal.lpPrice;
  // const { tokenUsdPrice } = useRefineryUsdPrice();
  const { onStake } = useStakeFarms(modal.farmId);
  const { onUnstake } = useUnstakeFarms(modal.farmId);
  // const { callWithGasPrice } = useCallWithGasPrice();

  const calculateValueByPercent = useCallback(
    (newPercentValue: number) =>
      (getBalanceAmount(new BigNumber(modal.maxValue)) * newPercentValue) / MAX_PERCENTAGE,
    [modal.maxValue],
  );
  const calculatePercentByValue = (newValue: number) =>
    (MAX_PERCENTAGE * newValue) / getBalanceAmount(new BigNumber(modal.maxValue));

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

  const valueToStakeAsBigNumber = useMemo(() => new BigNumber(valueToStake), [valueToStake]);

  const handleStake = useCallback(async () => {
    try {
      await onStake(valueToStake.toString());
      farmsStore.fetchFarmUserDataAsync(user.address, [modal.farmId]);
      successNotification('Staked!', 'Your funds have been staked in the farm!');
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  }, [user.address, onStake, valueToStake, farmsStore, modal.farmId]);

  const handleUnstake = useCallback(async () => {
    try {
      await onUnstake(valueToStake.toString());
      farmsStore.fetchFarmUserDataAsync(user.address, [modal.farmId]);
      successNotification('Unstaked!', 'Your earnings have also been harvested to your wallet!');
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  }, [user.address, onUnstake, valueToStake, farmsStore, modal.farmId]);

  const handleConfirm = async () => {
    clog(valueToStake);
    setPendingTx(true);
    if (modal.isStaking) {
      await handleStake();
    } else {
      await handleUnstake();
    }
    modal.close();
  };

  useEffect(() => {
    updateValueByPercent(percent);
  }, [percent, updateValueByPercent]);

  const usdValueToStake = useMemo(() => valueToStakeAsBigNumber.times(tokenUsdPrice).toFixed(2), [
    valueToStakeAsBigNumber,
    tokenUsdPrice,
  ]);

  useEffect(() => {
    // for any 'location' changes with opened modal
    return () => {
      modal.close();
    };
  }, [modal]);

  const isNotEnoughBalanceToStake = modal.maxValue === '0';

  const { addLiquidityUrl } = modal;

  return (
    <Modal
      isVisible={modal.isOpen}
      className="farms-stake-unstake-modal"
      handleCancel={modal.close}
      width={390}
      closeIcon
    >
      <div className="farms-stake-unstake-modal__content">
        <div className="farms-stake-unstake-modal__title text-smd text-bold text-purple">
          {modal.isStaking ? 'Stake in Pool' : 'Unstake'}
        </div>
        <div className="farms-stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-purple text-med text">{modal.isStaking ? 'Stake' : 'Unstake'}</span>
          <div className="box-f-ai-c farms-stake-unstake-modal__currency text-smd text-purple">
            <span>{modal.tokenSymbol}</span>
          </div>
        </div>
        <InputNumber
          className="farms-stake-unstake-modal__input"
          value={valueToStakeAsBigNumber.toNumber()}
          colorScheme="outline"
          inputSize="md"
          inputPrefix={
            <span className="text-ssm text-gray">
              ~{usdValueToStake} {mockData.additionalCurrency}
            </span>
          }
          prefixPosition="button"
          min={0}
          max={getBalanceAmount(new BigNumber(modal.maxValue))}
          // readOnly={!isBalanceFetched}
          onChange={handleValueChange}
        />
        <div className="farms-stake-unstake-modal__balance text-right">
          Balance:{' '}
          {getFullDisplayBalance({
            balance: new BigNumber(modal.maxValue),
            displayDecimals: 3,
          })}
        </div>
        <Slider value={percent} onChange={handlePercentChange} />
        <div className="box-f-ai-c box-f-jc-sb farms-stake-unstake-modal__btns">
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
        <Button
          className="farms-stake-unstake-modal__btn"
          loading={pendingTx}
          disabled={isNotEnoughBalanceToStake}
          onClick={isNotEnoughBalanceToStake ? undefined : handleConfirm}
        >
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
        {modal.isStaking && (
          <Button
            className="farms-stake-unstake-modal__btn farms-stake-unstake-modal__btn-get-currency"
            colorScheme="outline-purple"
            link={addLiquidityUrl}
          >
            <span className="text-bold text-smd">Get {modal.tokenSymbol}</span>
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default FarmsStakeUnstakeModal;
