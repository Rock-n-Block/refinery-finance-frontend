import { types, flow } from 'mobx-state-tree';
import { tokensApi } from '../../services/api';

const TokenModel = types.model({
  name: types.string,
  symbol: types.string,
  address: types.string,
  chainId: types.number,
  decimals: types.number,
  logoURI: types.string,
});

const TokensModel = types
  .model({
    default: types.optional(types.array(TokenModel), []),
    top: types.optional(types.array(TokenModel), []),
    extended: types.optional(types.array(TokenModel), []),
  })
  .actions((self) => {
    const getTokens = flow(function* getTokens(type: 'top' | 'default' | 'extended') {
      try {
        let responce;
        switch (type) {
          case 'top':
            responce = yield tokensApi.getTopTokens();
            break;
          case 'extended':
            responce = yield tokensApi.getExtendedTokens();
            break;
          default:
            responce = yield tokensApi.getDefaultTokens();
            break;
        }

        self[type] = responce.data;
      } catch (err) {
        console.log(err);
      }
    });
    return {
      getTokens,
    };
  });

export default TokensModel;
