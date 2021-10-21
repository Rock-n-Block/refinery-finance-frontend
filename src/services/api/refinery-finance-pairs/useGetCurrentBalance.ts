import { useCallback } from 'react';
import { gql, LazyQueryHookOptions, QueryTuple, useLazyQuery } from '@apollo/client';

import { getRfPairsContext } from '@/services/apolloClient';

interface IGetCurrentBalanceResponse {
  user: {
    TotalBalance: string;
    // __typename: "User"
  };
}

interface IGetCurrentBalanceVariables {
  user_address: string;
}

export const GET_CURRENT_BALANCE = gql`
  query GetCurrentBalance($user_address: String!) {
    user(id: $user_address) {
      TotalBalance
    }
  }
`;

/**
 * Allows to get current user balance to use it for voting power counting purposes.
 */
export const useGetCurrentBalance = (
  options?: LazyQueryHookOptions<IGetCurrentBalanceResponse, IGetCurrentBalanceVariables>,
): {
  getCurrentBalance: (userAddress: string) => void;
  options: QueryTuple<IGetCurrentBalanceResponse, IGetCurrentBalanceVariables>;
} => {
  const [func, responseData] = useLazyQuery<
    IGetCurrentBalanceResponse,
    IGetCurrentBalanceVariables
  >(GET_CURRENT_BALANCE, options);

  const getCurrentBalance = useCallback(
    (userAddress: string) => {
      func({
        ...getRfPairsContext(),
        variables: {
          user_address: userAddress,
        },
      });
    },
    [func],
  );

  return { getCurrentBalance, options: [func, responseData] };
};
