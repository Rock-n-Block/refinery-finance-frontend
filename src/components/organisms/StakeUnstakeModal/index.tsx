import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, InputNumber, Slider } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { Modal } from '@/components/molecules';
import useStakePool from '@/hooks/pools/useStakePool';
import useUnstakePool from '@/hooks/pools/useUnstakePool';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { convertRefineryToShares } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
import { BIG_ZERO } from '@/utils';
// import { BIG_ZERO } from '@/utils';
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from '@/utils/formatBalance';

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

const StakeUnstakeModal: React.FC = observer(() => {
  // const [balance, setBalance] = useState(0);
  // const [isBalanceFetched, setIsBalanceFetched] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const [percent, setPercent] = useState(MAX_PERCENTAGE / 4);
  const [valueToStake, setValueToStake] = useState(0);
  const { tokenUsdPrice } = useRefineryUsdPrice();

  const { modals, pools: poolsStore, user } = useMst();
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();
  const modal = modals.stakeUnstake;
  const { onStake } = useStakePool(modal.poolId);
  const { onUnstake } = useUnstakePool(modal.poolId);
  const { callWithGasPrice } = useCallWithGasPrice();

  const calculateValueByPercent = useCallback(
    (newPercentValue: number) =>
      (getBalanceAmount(new BigNumber(modal.maxStakingValue), modal.stakingToken?.decimals) *
        newPercentValue) /
      MAX_PERCENTAGE,
    [modal.maxStakingValue, modal.stakingToken?.decimals],
  );
  const calculatePercentByValue = (newValue: number) =>
    (MAX_PERCENTAGE * newValue) /
    getBalanceAmount(new BigNumber(modal.maxStakingValue), modal.stakingToken?.decimals);

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
    setPendingTx(true);
    if (modal.isAutoVault) {
      const valueToStakeDecimal = getDecimalAmount(
        valueToStakeAsBigNumber,
        modal.stakingToken?.decimals,
      );

      console.log('STAKING AUTO ', valueToStakeDecimal.toString());
      try {
        const refineryVaultContract = getContract('REFINERY_VAULT');
        const tx = await callWithGasPrice({
          contract: refineryVaultContract,
          methodName: 'deposit',
          methodArgs: [valueToStakeDecimal.toString()],
          options: { gas: 380000 },
        });
        if (tx.status) {
          successNotification('Staked!', 'Your funds have been staked in the pool');
          poolsStore.fetchVaultUserData(user.address);
        }
      } catch (error) {
        console.error(error);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        setPendingTx(false);
      }
    } else {
      try {
        await onStake(valueToStake.toString(), modal.stakingToken?.decimals || 18);
        successNotification(
          'Staked!',
          `Your ${modal.stakingToken?.symbol} funds have been staked in the pool!`,
        );
      } catch (e) {
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        setPendingTx(false);
      }
    }
  }, [
    modal.isAutoVault,
    callWithGasPrice,
    modal.stakingToken?.decimals,
    poolsStore,
    user.address,
    valueToStakeAsBigNumber,
    modal.stakingToken?.symbol,
    onStake,
    valueToStake,
  ]);

  const handleUnstake = useCallback(async () => {
    setPendingTx(true);
    if (modal.isAutoVault) {
      const refineryVaultContract = getContract('REFINERY_VAULT');
      const valueToStakeDecimal = getDecimalAmount(
        valueToStakeAsBigNumber,
        modal.stakingToken?.decimals,
      );

      const shareStakeToWithdraw = convertRefineryToShares(
        valueToStakeDecimal,
        pricePerFullShare || BIG_ZERO,
      );
      // trigger withdrawAll function if the withdrawal will leave 0.000001 CAKE or less
      const triggerWithdrawAllThreshold = new BigNumber(1000000000000);
      const sharesRemaining = userShares?.minus(shareStakeToWithdraw.sharesAsBigNumber) || BIG_ZERO;
      const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold);

      if (isWithdrawingAll) {
        try {
          const tx = await callWithGasPrice({
            contract: refineryVaultContract,
            methodName: 'withdrawAll',
            methodArgs: undefined,
            options: { gas: 380000 },
          });
          if (tx.status) {
            successNotification(
              'Unstaked!',
              'Your earnings have also been harvested to your wallet',
            );
            poolsStore.fetchVaultUserData(user.address);
          }
        } catch (error) {
          errorNotification(
            'Error',
            'Please try again. Confirm the transaction and make sure you are paying enough gas!',
          );
        } finally {
          setPendingTx(false);
        }
      } else {
        try {
          const tx = await callWithGasPrice({
            contract: refineryVaultContract,
            methodName: 'withdraw',
            methodArgs: [shareStakeToWithdraw.sharesAsBigNumber.toString()],
            options: { gas: 380000 },
          });
          if (tx.status) {
            successNotification(
              'Unstaked!',
              'Your earnings have also been harvested to your wallet',
            );
            poolsStore.fetchVaultUserData(user.address);
          }
        } catch (error) {
          errorNotification(
            'Error',
            'Please try again. Confirm the transaction and make sure you are paying enough gas!',
          );
        } finally {
          setPendingTx(false);
        }
      }
    } else {
      try {
        await onUnstake(valueToStake.toString(), modal.stakingToken?.decimals || 18);
        successNotification(
          'Unstaked!',
          `Your ${modal.stakingToken?.symbol} earnings have also been harvested to your wallet!`,
        );
      } catch (e) {
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        setPendingTx(false);
      }
    }
  }, [
    modal.isAutoVault,
    callWithGasPrice,
    modal.stakingToken?.decimals,
    poolsStore,
    pricePerFullShare,
    user.address,
    userShares,
    valueToStakeAsBigNumber,
    modal.stakingToken?.symbol,
    onUnstake,
    valueToStake,
  ]);

  console.log(valueToStake);

  const handleConfirm = async () => {
    console.log(modal, valueToStake);
    if (modal.isStaking) {
      // const isGreaterThanUserBalance = valueToStake.gt(balance);
      // modal.stake(isGreaterThanUserBalance ? balance : valueToStake);
      await handleStake();
    } else {
      // const isGreaterThanUserStaked = valueToStake.gt(modal.stakedValue);
      // modal.unstake(
      //   isGreaterThanUserStaked ? modal.stakedValue : valueToStake,
      // );
      await handleUnstake();
    }
    modal.close();
  };

  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     setBalance(5);
  //     setIsBalanceFetched(true);
  //   }, 5000);

  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // }, []);

  useEffect(() => {
    updateValueByPercent(percent);
  }, [percent, updateValueByPercent]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setBalance(3);
  //   }, 10000);
  // }, []);

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

  return (
    <Modal
      isVisible={modal.isOpen}
      className="stake-unstake-modal"
      handleCancel={modal.close}
      width={390}
      closeIcon
    >
      <div className="stake-unstake-modal__content">
        <div className="stake-unstake-modal__title text-smd text-bold text-purple">
          {modal.isStaking ? 'Stake in Pool' : 'Unstake'}
        </div>
        <div className="stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-purple text-med text">{modal.isStaking ? 'Stake' : 'Unstake'}</span>
          <div className="box-f-ai-c stake-unstake-modal__currency text-smd text-purple">
            <img
              className="stake-unstake-modal__currency-icon"
              src={modal.stakingToken?.logoURI || UnknownImg}
              alt=""
            />
            <span>{modal.stakingToken?.symbol}</span>
          </div>
        </div>
        <InputNumber
          className="stake-unstake-modal__input"
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
          max={getBalanceAmount(new BigNumber(modal.maxStakingValue), modal.stakingToken?.decimals)}
          // readOnly={!isBalanceFetched}
          onChange={handleValueChange}
        />
        <div className="stake-unstake-modal__balance text-right">
          Balance:{' '}
          {getFullDisplayBalance({
            balance: new BigNumber(modal.maxStakingValue),
            decimals: modal.stakingToken?.decimals,
            displayDecimals: 3,
          })}
        </div>
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
        <Button className="stake-unstake-modal__btn" loading={pendingTx} onClick={handleConfirm}>
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
        {modal.isStaking && (
          <Button
            className="stake-unstake-modal__btn stake-unstake-modal__btn-get-currency"
            colorScheme="outline-purple"
            link="/trade/swap"
          >
            <span className="text-bold text-smd">Get RP1</span>
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default StakeUnstakeModal;
