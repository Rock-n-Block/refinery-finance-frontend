import { types } from 'mobx-state-tree';

const TokenPriceValueModel = types.model({
  id: types.identifier,
  value: types.string,
});
const TokenPriceModel = types.model({
  id: types.identifier,
  data: types.map(TokenPriceValueModel),
});
const TokenPricesModel = types
  .model('TokenPricesModel', {
    data: types.map(TokenPriceModel),
  })
  .actions((self) => {
    const setTokenPrice = (fromTokenAddress: string, toTokenAddress: string, value: string) => {
      const fromTokenAddressLowercased = fromTokenAddress.toLowerCase();
      const toTokenAddressLowercased = toTokenAddress.toLowerCase();
      // console.log('setTokenPriceARGS', fromTokenAddressLowercased, toTokenAddressLowercased, value);
      const prevValue = self.data.get(fromTokenAddressLowercased);
      if (!prevValue) {
        self.data.set(
          fromTokenAddressLowercased,
          TokenPriceModel.create({
            id: fromTokenAddressLowercased,
            data: {},
          }),
        );
        self.data.get(fromTokenAddressLowercased)?.data.set(
          toTokenAddressLowercased,
          TokenPriceValueModel.create({
            id: toTokenAddressLowercased,
            value,
          }),
        );
      }
      // TODO: on update of rates
    };

    return {
      setTokenPrice,
    };
  })
  .views((self) => {
    /**
     * @param fromTokenAddress 1 USD
     * @param toTokenAddress as 84 RUB
     */
    const getTokenPrice = (fromTokenAddress: string, toTokenAddress: string) => {
      const fromTokenAddressLowercased = fromTokenAddress.toLowerCase();
      const toTokenAddressLowercased = toTokenAddress.toLowerCase();
      const toTokens = self.data.get(fromTokenAddressLowercased);
      if (!toTokens) return '';
      const valueStore = toTokens.data.get(toTokenAddressLowercased);
      if (!valueStore) return '';
      return valueStore.value;
    };

    return {
      getTokenPrice,
    };
  });

export default TokenPricesModel;
