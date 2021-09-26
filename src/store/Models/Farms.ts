import { types } from 'mobx-state-tree';

import { farms as farmsConfig } from '@/config';

import AddressModel from './Address';
import TokenModel from './Token';

const UserDataModel = types.model({
  allowance: types.string,
  tokenBalance: types.string,
  stakedBalance: types.string,
  earnings: types.string,
});

const FarmModel = types.model({
  pid: types.number,
  lpSymbol: types.string,
  lpAddresses: AddressModel,
  token: TokenModel,
  quoteToken: TokenModel,
  multiplier: types.maybe(types.string),
  categoryType: types.string,
  // dual: types.maybe(
  //   types.model({
  //     rewardPerBlock: types.number,
  //     earnLabel: types.string,
  //     endBlock: types.number,
  //   }),
  // ),

  tokenAmountMc: types.maybe(types.string),
  quoteTokenAmountMc: types.maybe(types.string),
  tokenAmountTotal: types.maybe(types.string),
  quoteTokenAmountTotal: types.maybe(types.string),
  lpTotalInQuoteToken: types.maybe(types.string),
  lpTotalSupply: types.maybe(types.string),
  tokenPriceVsQuote: types.maybe(types.string),
  poolWeight: types.maybe(types.string),
  userData: types.maybe(UserDataModel),
});

const FarmsModel = types
  .model({
    data: types.optional(types.array(FarmModel), farmsConfig),
  })
  .actions((self) => ({
    lol() {
      return self;
    },
    // setEstimated(value: number) {
    //   self.estimatedRefineryBountyReward = new BigNumber(value)
    //     .multipliedBy(new BigNumber(10).pow(18))
    //     .toJSON();
    // },
    // fetchVaultFeesSuccess(aggregatedCallsResponse: any) {
    //   // if (!aggregatedCallsResponse) throw new Error('MultiCallResponse is null');
    //   const callsResult = aggregatedCallsResponse?.flat();
    //   const [
    //     performanceFee,
    //     callFee,
    //     withdrawalFee,
    //     withdrawalFeePeriod,
    //   ] = callsResult?.map((result: any) => Number(result));
    //   // console.log(performanceFee, callFee, withdrawalFee, withdrawalFeePeriod);
    //   self.fees = {
    //     performanceFee,
    //     callFee,
    //     withdrawalFee,
    //     withdrawalFeePeriod,
    //   };
    // },
  }));

export default FarmsModel;
