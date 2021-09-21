import { getAddress, getContract, getContractAddress } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import BigNumber from 'bignumber.js/bignumber';
import { useState, useEffect, useCallback } from 'react';
import useLastUpdated from '../useLastUpdated';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { metamaskService } from '@/services/MetamaskConnect';
import { IReceipt } from '@/types';
import { MAX_UINT_256 } from '@/utils';
import { Contract } from 'web3-eth-contract';

export const useApprovePool = (lpContract: Contract, poolId: number) => {
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { callWithGasPrice } = useCallWithGasPrice();
  const { user, pools: poolsStore } = useMst();
  const foundPool = poolsConfig.find((pool) => pool.id === poolId);
  if (!foundPool) throw new Error('Specify the correct poolId');
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const tx = await callWithGasPrice({
        contract: lpContract,
        methodName: 'approve',
        methodArgs: [smartRefinerInitContract.options.address, MAX_UINT_256],
        options: {
          gas: 300000,
        },
      });
      console.log(tx);

      poolsStore.updateUserAllowance(poolId, user.address);
      if ((tx as IReceipt).status) {
        // toastSuccess(
        //   t('Contract Enabled'),
        //   t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol }),
        // );
        setRequestedApproval(false);
      } else {
        // user rejected tx or didn't go thru
        // toastError(
        //   t('Error'),
        //   t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
        // );
        setRequestedApproval(false);
      }
    } catch (e) {
      console.error(e);
      // toastError(
      //   t('Error'),
      //   t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      // );
    }
  }, [callWithGasPrice, lpContract, poolId, poolsStore, smartRefinerInitContract, user.address]);

  return { handleApprove, requestedApproval };
};

// Approve CAKE auto pool
export const useVaultApprove = (setLastUpdated: () => void) => {
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { callWithGasPrice } = useCallWithGasPrice();

  const rocketPropellantContract = getContract('RP1');
  const vaultAddress = getContractAddress('REFINERY_VAULT');

  const handleApprove = async () => {
    const tx = await callWithGasPrice({
      contract: rocketPropellantContract,
      methodName: 'approve',
      methodArgs: [vaultAddress, MAX_UINT_256],
      options: {
        gas: 300000,
      },
    });
    setRequestedApproval(true);
    if ((tx as IReceipt).status) {
      // toastSuccess(
      //   t('Contract Enabled'),
      //   t('You can now stake in the %symbol% vault!', { symbol: 'CAKE' }),
      // );
      setLastUpdated();
      setRequestedApproval(false);
    } else {
      // toastError(
      //   t('Error'),
      //   t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      // );
      setRequestedApproval(false);
    }
  };

  return { handleApprove, requestedApproval };
};

export const useCheckVaultApprovalStatus = () => {
  const [isVaultApproved, setIsVaultApproved] = useState(false);
  const { user } = useMst();
  const rocketPropellantContract = getContract('RP1');
  const vaultAddress = getContractAddress('REFINERY_VAULT');
  const { lastUpdated, setLastUpdated } = useLastUpdated();
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await rocketPropellantContract.methods.allowance(
          user.address,
          vaultAddress,
        );
        const currentAllowance = new BigNumber(response.toString());
        setIsVaultApproved(currentAllowance.gt(0));
      } catch (error) {
        setIsVaultApproved(false);
      }
    };

    checkApprovalStatus();
  }, [user.address, vaultAddress, lastUpdated, rocketPropellantContract.methods]);

  return { isVaultApproved, setLastUpdated };
};
