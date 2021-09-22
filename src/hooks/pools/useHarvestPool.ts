import { useCallback } from 'react';
import { useMst } from '@/store';
import { getAddress, getContract } from '@/services/web3/contractHelpers';
// import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { Contract } from 'web3-eth-contract';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useHarvestFarm } from '@/hooks/farms/useHarvestFarm';
import { metamaskService } from '@/services/MetamaskConnect';

const useHarvestPoolDeposit = (smartRefinerInitContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();
  const harvestPool = useCallback(async () => {
    const tx = await callWithGasPrice({
      contract: smartRefinerInitContract,
      methodName: 'deposit',
      methodArgs: ['0'],
      options: {
        gas: 300000,
      },
    });
    return tx.status;
  }, [callWithGasPrice, smartRefinerInitContract]);

  return { harvestPool };
};

const useHarvestPool = (poolId: number) => {
  const { user, pools } = useMst();

  const [foundPool] = poolsConfig.filter((pool) => pool.id === poolId);
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );
  const { harvestPool } = useHarvestPoolDeposit(smartRefinerInitContract);

  const masterRefinerContract = getContract('MASTER_REFINER');
  const { harvestFarm } = useHarvestFarm(masterRefinerContract, 0);

  const handleHarvest = useCallback(async () => {
    if (poolId === 0) {
      await harvestFarm();
    } else {
      await harvestPool();
    }
    pools.updateUserPendingReward(poolId, user.address);
    pools.updateUserBalance(poolId, user.address);
  }, [harvestFarm, harvestPool, poolId, pools, user.address]);

  return { onReward: handleHarvest };
};

export default useHarvestPool;
