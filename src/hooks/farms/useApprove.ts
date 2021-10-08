import { useCallback } from 'react';
import { Contract } from 'web3-eth-contract';

import { getContractAddress } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { MAX_UINT_256 } from '@/utils/constants';

const masterRefinerContractAddress = getContractAddress('MASTER_REFINER');

const useApproveFarm = (lpContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();
  const handleApprove = useCallback(async () => {
    try {
      const tx = await callWithGasPrice({
        contract: lpContract,
        methodName: 'approve',
        methodArgs: [masterRefinerContractAddress, MAX_UINT_256],
        options: {
          gas: 300000,
        },
      });

      return tx.status;
    } catch (e) {
      console.error('Approve error', e);
      return false;
    }
  }, [lpContract, callWithGasPrice]);

  return { onApprove: handleApprove };
};

export default useApproveFarm;
