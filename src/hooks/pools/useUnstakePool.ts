import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getAddress, getContract } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { useCallback } from 'react';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import BigNumber from 'bignumber.js/bignumber';
import { BIG_TEN } from '@/utils';
import { Contract } from 'web3-eth-contract';
import { useUnstakeFarm } from '@/hooks/farms/useUnstakeFarm';

export const useSmartRefinerUnstake = (smartRefinerInitContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const smartRefinerUnstake = useCallback(
    async (amount: string, decimals = 18) => {
      const tx = await callWithGasPrice({
        contract: smartRefinerInitContract,
        methodName: 'withdraw',
        methodArgs: [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()],
        options: {
          gas: 300000,
        },
      });
      return tx.status;
    },
    [callWithGasPrice, smartRefinerInitContract],
  );

  return { smartRefinerUnstake };
};

const useUnstakePool = (poolId: number) => {
  const { metamaskService } = useWalletConnectorContext();
  const { user, pools } = useMst();

  const [foundPool] = poolsConfig.filter((pool) => pool.id === poolId);
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );
  const { smartRefinerUnstake } = useSmartRefinerUnstake(smartRefinerInitContract);

  const masterRefinerContract = getContract('MASTER_REFINER');
  const { unstakeFarm } = useUnstakeFarm(masterRefinerContract);

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (poolId === 0) {
        await unstakeFarm(0, amount);
      } else {
        await smartRefinerUnstake(amount, decimals);
      }
      pools.updateUserStakedBalance(poolId, user.address);
      pools.updateUserBalance(poolId, user.address);
      pools.updateUserPendingReward(poolId, user.address);
    },
    [poolId, pools, user.address, smartRefinerUnstake, unstakeFarm],
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakePool;
