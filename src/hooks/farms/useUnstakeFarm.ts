import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useCallback } from 'react';
import { Contract } from 'web3-eth-contract';
import { DEFAULT_TOKEN_DECIMAL } from '@/utils';
import BigNumber from 'bignumber.js/bignumber';

export const useUnstakeFarm = (masterRefinerContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const unstakeFarm = useCallback(
    async (pid: number, amount: any) => {
      const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
      if (pid === 0) {
        const tx = await callWithGasPrice({
          contract: masterRefinerContract,
          methodName: 'leaveStaking',
          methodArgs: [value],
          options: {
            gas: 300000,
          },
        });
        return tx.status;
      }

      const tx = await callWithGasPrice({
        contract: masterRefinerContract,
        methodName: 'withdraw',
        methodArgs: [pid, value],
        options: {
          gas: 300000,
        },
      });
      return tx.status;
    },
    [callWithGasPrice, masterRefinerContract],
  );

  return { unstakeFarm };
};
