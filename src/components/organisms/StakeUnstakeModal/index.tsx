import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import { Contract } from 'web3-eth-contract';

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
import { convertRefineryToShares, IConvertRefineryToSharesResult } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
// import { BIG_ZERO } from '@/utils';
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from '@/utils/formatters';
import { clog, clogData, clogError } from '@/utils/logger';

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

const gasOptions = { gas: 380000 };

const StakeUnstakeModal: React.FC = observer(() => {
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

  const updateViewByFetchingBlockchainData = useCallback(() => {
    poolsStore.fetchVaultUserData(user.address);
    poolsStore.fetchPoolsPublicDataAsync();
  }, [poolsStore, user.address]);

  const vaultStake = useCallback(async () => {
    const valueToStakeDecimal = getDecimalAmount(
      valueToStakeAsBigNumber,
      modal.stakingToken?.decimals,
    );

    clog('STAKING AUTO ', valueToStakeDecimal.toFixed());
    try {
      const refineryVaultContract = getContract('REFINERY_VAULT');
      const tx = await callWithGasPrice({
        contract: refineryVaultContract,
        methodName: 'deposit',
        methodArgs: [valueToStakeDecimal.toFixed()],
        options: gasOptions,
      });
      if (tx.status) {
        successNotification('Staked!', 'Your funds have been staked in the pool');
        updateViewByFetchingBlockchainData();
      }
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  }, [
    callWithGasPrice,
    modal.stakingToken?.decimals,
    valueToStakeAsBigNumber,
    updateViewByFetchingBlockchainData,
  ]);

  const nonVaultStake = useCallback(async () => {
    try {
      await onStake(valueToStake.toString(), modal.stakingToken?.decimals || 18);
      successNotification(
        'Staked!',
        `Your ${modal.stakingToken?.symbol} funds have been staked in the pool!`,
      );
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  }, [modal.stakingToken?.decimals, modal.stakingToken?.symbol, onStake, valueToStake]);

  const handleStake = useCallback(async () => {
    setPendingTx(true);
    if (modal.isAutoVault) {
      await vaultStake();
    } else {
      await nonVaultStake();
    }
  }, [modal.isAutoVault, vaultStake, nonVaultStake]);

  const withdrawAll = useCallback(
    async (refineryVaultContract: Contract) => {
      try {
        const tx = await callWithGasPrice({
          contract: refineryVaultContract,
          methodName: 'withdrawAll',
          methodArgs: undefined,
          options: gasOptions,
        });
        if (tx.status) {
          successNotification('Unstaked!', 'Your earnings have also been harvested to your wallet');
          updateViewByFetchingBlockchainData();
        }
      } catch (error) {
        clogError(error);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        setPendingTx(false);
      }
    },
    [callWithGasPrice, updateViewByFetchingBlockchainData],
  );

  const withdraw = useCallback(
    async (
      refineryVaultContract: Contract,
      shareStakeToWithdraw: IConvertRefineryToSharesResult,
    ) => {
      clogData(
        'Converted to Shares UNSTAKING VALUE',
        shareStakeToWithdraw.sharesAsBigNumber.toFixed(0, BigNumber.ROUND_DOWN),
      );
      try {
        const tx = await callWithGasPrice({
          contract: refineryVaultContract,
          methodName: 'withdraw',
          methodArgs: [shareStakeToWithdraw.sharesAsBigNumber.toFixed(0, BigNumber.ROUND_DOWN)],
          options: gasOptions,
        });
        if (tx.status) {
          successNotification('Unstaked!', 'Your earnings have also been harvested to your wallet');
          updateViewByFetchingBlockchainData();
        }
      } catch (error) {
        clogError(error);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        setPendingTx(false);
      }
    },
    [callWithGasPrice, updateViewByFetchingBlockchainData],
  );

  const handleUnstake = useCallback(async () => {
    setPendingTx(true);
    if (modal.isAutoVault) {
      const refineryVaultContract = getContract('REFINERY_VAULT');
      const valueToStakeDecimal = getDecimalAmount(
        valueToStakeAsBigNumber,
        modal.stakingToken?.decimals,
      );

      clogData('UNSTAKING VALUE', {
        valueToStake,
        valueToStakeDecimal,
        pricePerFullShare,
        valueToStakeDecimalToFixed: valueToStakeDecimal.toFixed(),
        pricePerFullShareToFixed: pricePerFullShare?.toFixed(),
        userShares,
      });

      if (!pricePerFullShare || !userShares) return;

      const shareStakeToWithdraw = convertRefineryToShares(valueToStakeDecimal, pricePerFullShare);
      // trigger withdrawAll function if the withdrawal will leave 0.000001 RP1 or less
      const triggerWithdrawAllThreshold = convertRefineryToShares(
        new BigNumber(1000000000000),
        pricePerFullShare,
      ).sharesAsBigNumber;
      const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber);

      clogData(
        'TEST WITHDRAW ALL',
        userShares.toFixed(),
        shareStakeToWithdraw.sharesAsBigNumber.toFixed(),
        sharesRemaining.toFixed(),
        triggerWithdrawAllThreshold.toFixed(),
      );
      const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold);

      if (isWithdrawingAll) {
        await withdrawAll(refineryVaultContract);
      } else {
        await withdraw(refineryVaultContract, shareStakeToWithdraw);
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
    modal.stakingToken?.decimals,
    modal.stakingToken?.symbol,
    userShares,
    pricePerFullShare,
    valueToStake,
    valueToStakeAsBigNumber,
    onUnstake,
    withdrawAll,
    withdraw,
  ]);

  const handleConfirm = async () => {
    clog(valueToStake);
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

  const isNotEnoughBalanceToStake = modal.maxStakingValue === 0;

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
        <Button
          className="stake-unstake-modal__btn"
          loading={pendingTx}
          disabled={isNotEnoughBalanceToStake}
          onClick={isNotEnoughBalanceToStake ? undefined : handleConfirm}
        >
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
