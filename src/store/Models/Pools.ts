import { types } from 'mobx-state-tree';
import BigNumber from 'bignumber.js/bignumber';

import { pools as poolsConfig } from '@/config';
import { convertSharesToRefinery } from '@/store/pools/helpers';
import { getAddress, getContract, getContractData } from '@/services/web3/contractHelpers';
import { multicall } from '@/utils/multicall';
import { metamaskService } from '@/services/MetamaskConnect';
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
  // fetch block limits (ends in)
  fetchPoolsBlockLimits,
  fetchPoolsStakingLimits,
  fetchPoolsTotalStaking,
} from '@/store/pools';
import { getTokenPricesFromFarms } from '@/store/farms';

import FeesModel from './Fees';
import AddressModel from './Address';
import TokenModel from './Token';
import { getBalanceAmount } from '@/utils/formatBalance';
import { getPoolApr } from '@/utils/apr';
import { BIG_ZERO } from '@/utils';

const UserDataModel = types.model({
  allowance: types.string,
  stakingTokenBalance: types.string,
  stakedBalance: types.string,
  pendingReward: types.string,
});

const PoolModel = types.model({
  id: types.number,
  earningToken: TokenModel,
  stakingToken: TokenModel,
  contractAddress: AddressModel,
  tokenPerBlock: types.string,

  isFinished: types.optional(types.boolean, false),
  enableEmergencyWithdraw: types.optional(types.boolean, false),

  totalStaked: types.optional(types.string, '0'),
  stakingLimit: types.optional(types.string, '0'),
  startBlock: types.optional(types.number, 0),
  endBlock: types.optional(types.number, 0),
  apr: types.optional(types.number, 0),
  stakingTokenPrice: types.optional(types.number, 0),
  earningTokenPrice: types.optional(types.number, 0),
  isAutoVault: types.optional(types.boolean, false),
  userData: types.optional(UserDataModel, {
    allowance: '',
    stakingTokenBalance: '',
    stakedBalance: '',
    pendingReward: '',
  }),
});

const PoolsModel = types
  .model({
    data: types.optional(types.array(PoolModel), poolsConfig),
    totalShares: types.optional(types.maybeNull(types.string), null),
    pricePerFullShare: types.optional(types.maybeNull(types.string), null),
    totalRefineryInVault: types.optional(types.maybeNull(types.string), null),
    estimatedRefineryBountyReward: types.optional(types.maybeNull(types.string), null),
    fees: FeesModel,
    userData: types.model({
      isLoading: types.boolean,
      userShares: types.maybeNull(types.string),
      lastDepositedTime: types.maybeNull(types.string),
      lastUserActionTime: types.maybeNull(types.string),
      refineryAtLastUserAction: types.maybeNull(types.string),
    }),
  })
  .actions((self) => ({
    // fetchCallFeeSuccess(callFee: string) {
    //   self.fees.callFee = Number(callFee);
    // },
    // fetchCallFeeError(error: any) {
    //   console.error(error);
    // },
    // fetchCallFee() {
    //   const callFee = getRefineryVaultContractMethodCallFee();
    //   console.log(callFee);
    //   callFee.call().then(this.fetchCallFeeSuccess, this.fetchCallFeeError);
    //   // useEffect(() => {
    //   //   callFee.call().then(this.fetchCallFeeSuccess, this.fetchCallFeeError);
    //   // }, [callFee]);
    // },
    setEstimated(value: number) {
      self.estimatedRefineryBountyReward = new BigNumber(value)
        .multipliedBy(new BigNumber(10).pow(18))
        .toJSON();
    },

    fetchVaultFeesSuccess(aggregatedCallsResponse: any) {
      // if (!aggregatedCallsResponse) throw new Error('MultiCallResponse is null');
      const callsResult = aggregatedCallsResponse?.flat();
      const [
        performanceFee,
        callFee,
        withdrawalFee,
        withdrawalFeePeriod,
      ] = callsResult?.map((result: any) => Number(result));

      // console.log(performanceFee, callFee, withdrawalFee, withdrawalFeePeriod);
      self.fees = {
        performanceFee,
        callFee,
        withdrawalFee,
        withdrawalFeePeriod,
      };
    },
    fetchVaultFeesError(error: any) {
      console.error(error);
      self.fees = {
        performanceFee: null,
        callFee: null,
        withdrawalFee: null,
        withdrawalFeePeriod: null,
      };
    },
    fetchVaultFees() {
      const [address, abi] = getContractData('REFINERY_VAULT') as [string, []];
      const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map(
        (method) => ({
          address,
          name: method,
        }),
      );
      multicall(abi, calls).then(this.fetchVaultFeesSuccess, this.fetchVaultFeesError);
    },

    fetchVaultPublicDataSuccess(aggregatedCallsResponse: any) {
      // if (!aggregatedCallsResponse) throw new Error('MultiCallResponse is null');
      const callsResult = aggregatedCallsResponse?.flat();
      const [
        sharePrice,
        shares,
        estimatedRefineryBountyReward,
        // totalPendingRefineryHarvest,
      ] = callsResult?.map((result: any) => Number(result));

      const totalSharesAsBigNumber = new BigNumber(shares ? shares.toString() : 0);
      const sharePriceAsBigNumber = new BigNumber(sharePrice ? sharePrice.toString() : 0);
      const totalRefineryInVaultEstimate = convertSharesToRefinery(
        totalSharesAsBigNumber,
        sharePriceAsBigNumber,
      );

      self.totalShares = totalSharesAsBigNumber.toJSON();
      self.pricePerFullShare = sharePriceAsBigNumber.toJSON();
      self.totalRefineryInVault = totalRefineryInVaultEstimate.refineryAsBigNumber.toJSON();
      self.estimatedRefineryBountyReward = new BigNumber(
        estimatedRefineryBountyReward.toString(),
      ).toJSON();
      // setTimeout(() => {
      //   // self.estimatedRefineryBountyReward = new BigNumber(41421100000).toJSON();
      //   this.setEstimated(1.0);

      //   setTimeout(() => {
      //     this.setEstimated(1.2123);

      //     setTimeout(() => {
      //       this.setEstimated(0.002);

      //       setTimeout(() => {
      //         this.setEstimated(0);
      //       }, 1000);
      //     }, 1000);
      //   }, 1000);
      // }, 1000);
      // totalPendingRefineryHarvest: new BigNumber(totalPendingRefineryHarvest.toString()).toJSON(),
    },
    fetchVaultPublicDataError(error: any) {
      console.error(error);
      self.totalShares = null;
      self.pricePerFullShare = null;
      self.totalRefineryInVault = null;
      self.estimatedRefineryBountyReward = null;
      // totalPendingRefineryHarvest: new BigNumber(totalPendingRefineryHarvest.toString()).toJSON(),
    },
    fetchVaultPublicData() {
      const [address, abi] = getContractData('REFINERY_VAULT') as [string, []];
      const calls = [
        'getPricePerFullShare',
        'totalShares',
        'calculateHarvestRefineryRewards',
        // 'calculateTotalPendingRefineryRewards',
      ].map((method) => ({
        address,
        name: method,
      }));
      multicall(abi, calls).then(this.fetchVaultPublicDataSuccess, this.fetchVaultPublicDataError);
    },

    fetchVaultUserDataError(error: any) {
      console.error(error);
      self.userData = {
        isLoading: true,
        userShares: null,
        lastDepositedTime: null,
        lastUserActionTime: null,
        refineryAtLastUserAction: null,
      };
    },
    fetchVaultUserDataSuccess(response: any) {
      const {
        shares,
        lastDepositedTime,
        lastUserActionTime,
        refineryAtLastUserAction: refineryAtLastUserActionAsString,
      } = response;
      self.userData = {
        isLoading: false,
        userShares: new BigNumber(shares).toJSON(),
        lastDepositedTime,
        lastUserActionTime,
        refineryAtLastUserAction: new BigNumber(refineryAtLastUserActionAsString).toJSON(),
      };
    },
    fetchVaultUserData(address: string) {
      const contract = getContract('REFINERY_VAULT');
      contract.methods
        .userInfo(address)
        .call()
        .then(this.fetchVaultUserDataSuccess, this.fetchVaultUserDataError);
    },

    fetchPoolsPublicData() {
      this.fetchPoolsPublicDataAsync();
      this.fetchPoolsStakingLimitsAsync();
    },

    async fetchPoolsPublicDataAsync() {
      const currentBlock = await metamaskService.web3Provider.eth.getBlockNumber();

      const blockLimits = await fetchPoolsBlockLimits();
      const totalStakings = await fetchPoolsTotalStaking();

      const prices = getTokenPricesFromFarms();

      console.log(Object.freeze(prices));

      const livePoolsData = poolsConfig.map((pool) => {
        const blockLimit = blockLimits.find((entry) => entry.id === pool.id);
        const totalStaking = totalStakings.find((entry) => entry.id === pool.id);
        const isPoolEndBlockExceeded =
          currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false;
        const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded;

        const stakingTokenAddress = pool.stakingToken.address
          ? getAddress(pool.stakingToken.address).toLowerCase()
          : null;
        const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0;

        const earningTokenAddress = pool.earningToken.address
          ? getAddress(pool.earningToken.address).toLowerCase()
          : null;
        const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0;
        const calculatedApr = getPoolApr(
          stakingTokenPrice,
          earningTokenPrice,
          getBalanceAmount(
            new BigNumber(totalStaking ? totalStaking.totalStaked : 0),
            pool.stakingToken.decimals,
          ),
          parseFloat(pool.tokenPerBlock),
        );
        const apr = !isPoolFinished && calculatedApr !== null ? calculatedApr : 0;

        return {
          ...blockLimit,
          ...totalStaking,
          stakingTokenPrice,
          earningTokenPrice,
          apr,
          isFinished: isPoolFinished,
        };
      });

      this.setPoolsPublicData(livePoolsData);
    },
    // @note livePoolsData type just copied from type derivation
    setPoolsPublicData(
      livePoolsData: Array<{
        stakingTokenPrice: number;
        earningTokenPrice: number;
        apr: number;
        isFinished: boolean;
        id?: number;
        totalStaked?: string;
        startBlock?: number;
        endBlock?: number;
      }>,
    ) {
      self.data.forEach((pool) => {
        const livePoolData = livePoolsData.find(({ id }) => id === pool.id);
        if (livePoolData) {
          pool.stakingTokenPrice = livePoolData.stakingTokenPrice;
          pool.earningTokenPrice = livePoolData.earningTokenPrice;
          pool.apr = livePoolData.apr;
          pool.isFinished = livePoolData.isFinished;

          if (livePoolData.totalStaked !== undefined) {
            pool.totalStaked = livePoolData.totalStaked;
          }
          if (livePoolData.startBlock !== undefined) {
            pool.startBlock = livePoolData.startBlock;
          }
          if (livePoolData.endBlock !== undefined) {
            pool.endBlock = livePoolData.endBlock;
          }
        }
      });
    },

    async fetchPoolsStakingLimitsAsync() {
      const poolsWithStakingLimit = self.data
        .filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
        .map((pool) => pool.id);

      const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit);

      const stakingLimitData = poolsConfig.map((pool) => {
        if (poolsWithStakingLimit.includes(pool.id)) {
          return { id: pool.id };
        }
        const stakingLimit = stakingLimits[pool.id] || BIG_ZERO;
        return {
          id: pool.id,
          stakingLimit: stakingLimit.toJSON(),
        };
      });

      this.setPoolsPublicData(stakingLimitData);
    },

    async updateUserAllowance(poolId: number, accountAddress: string) {
      const allowances = await fetchPoolsAllowance(accountAddress);

      this.updatePoolsUserData({ poolId, field: 'allowance', value: allowances[poolId] });
    },

    updatePoolsUserData({
      field,
      value,
      poolId,
    }: {
      poolId: number;
      field: string;
      value: string;
    }) {
      const foundPool = self.data.find((p) => p.id === poolId);
      // console.log('FIELD VALUE POOLID', field, value, poolId);
      // console.log('FOUND POOL TO CHANGE', foundPool);
      if (!foundPool) return;
      (foundPool.userData as any)[field] = value;
      // foundPool.userData[field] = value;

      // console.log('CHANGED SELF', JSON.stringify(self));

      // if (index >= 0) {

      //   self.data[index] = {
      //     ...self.data[index],
      //     userData: { ...self.data[index].userData, [field]: value },
      //   };
      // }
    },

    // FETCH ALLOWANCES ETC. FOR POOLS
    async fetchPoolsUserDataAsync(accountAddress: string) {
      const allowances = await fetchPoolsAllowance(accountAddress);
      const stakingTokenBalances = await fetchUserBalances(accountAddress);
      const stakedBalances = await fetchUserStakeBalances(accountAddress);
      const pendingRewards = await fetchUserPendingRewards(accountAddress);

      const userData = poolsConfig.map((pool) => ({
        id: pool.id,
        allowance: allowances[pool.id],
        stakingTokenBalance: stakingTokenBalances[pool.id],
        stakedBalance: stakedBalances[pool.id],
        pendingReward: pendingRewards[pool.id],
      }));

      this.setPoolsUserData(userData);
    },

    setPoolsUserData(
      userData: Array<{
        id: number;
        allowance: string;
        stakingTokenBalance: string;
        stakedBalance: string;
        pendingReward: string;
      }>,
    ) {
      userData.forEach((newUserData) => {
        const foundPool = self.data.find((pool) => newUserData.id === pool.id);
        if (foundPool) {
          foundPool.userData = newUserData;
        }
      });
      // self.data.forEach((pool) => {
      //   const userPoolData = userData.find((entry) => entry.id === pool.id);
      //   if (userPoolData) {
      //     userPoolData
      //   }
      //   return { ...pool, userData: userPoolData }
      // })
      // state.userDataLoaded = true
    },
  }));

export default PoolsModel;
