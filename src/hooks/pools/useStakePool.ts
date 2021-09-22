import { useCallback } from 'react';
import { useMst } from '@/store';
import { getAddress, getContract } from '@/services/web3/contractHelpers';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { Contract } from 'web3-eth-contract';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useStakeFarm } from '@/hooks/farms/useStakeFarm';
import { BIG_TEN } from '@/utils';
import BigNumber from 'bignumber.js/bignumber';

export const useSmartRefinerStake = (smartRefinerInitContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const smartRefinerStake = useCallback(async (amount: string, decimals = 18) => {
    const tx = await callWithGasPrice({
      contract: smartRefinerInitContract,
      methodName: 'deposit',
      methodArgs: [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()],
      options: {
        gas: 300000,
      },
    });
    return tx.status;
  }, [callWithGasPrice, smartRefinerInitContract]);

  // const tx = await callWithGasPrice({
  //   contract: smartRefinerInitContract,
  //   methodName: 'deposit',
  //   methodArgs: [new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()],
  //   options: {
  //     gas: 300000,
  //   },
  // });
  // return tx.status;

  return { smartRefinerStake };
};

const useStakePool = (poolId: number) => {
  const { metamaskService } = useWalletConnectorContext();
  const { user, pools } = useMst();

  const [foundPool] = poolsConfig.filter((pool) => pool.id === poolId);
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );
  const { smartRefinerStake } = useSmartRefinerStake(smartRefinerInitContract);
  // const { harvestPool } = useHarvestPoolDeposit(smartRefinerInitContract);

  const masterRefinerContract = getContract('MASTER_REFINER');
  const { stakeFarm } = useStakeFarm(masterRefinerContract);
  // const { harvestFarm } = useHarvestFarm(masterRefinerContract, 0);

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (poolId === 0) {
        await stakeFarm(0, amount);
      } else {
        await smartRefinerStake(amount, decimals);
      }
      pools.updateUserStakedBalance(poolId, user.address);
      pools.updateUserBalance(poolId, user.address);
    },
    [poolId, pools, user.address, smartRefinerStake, stakeFarm],
  );

  return { onStake: handleStake };
};

export default useStakePool;
