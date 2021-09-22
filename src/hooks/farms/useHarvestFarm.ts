import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useCallback } from 'react';
import { Contract } from 'web3-eth-contract';

export const useHarvestFarm = (masterRefinerContract: Contract, pid: number) => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const harvestFarm = useCallback(async () => {
    if (pid === 0) {
      const tx = await callWithGasPrice({
        contract: masterRefinerContract,
        methodName: 'leaveStaking',
        methodArgs: ['0'],
        options: {
          gas: 300000,
        },
      });
      return tx.status;
    }

    const tx = await callWithGasPrice({
      contract: masterRefinerContract,
      methodName: 'deposit',
      methodArgs: [pid, '0'],
      options: {
        gas: 300000,
      },
    });
    return tx.status;
  }, [callWithGasPrice, masterRefinerContract, pid]);

  return { harvestFarm };
};
