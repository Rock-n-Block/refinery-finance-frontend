import React from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as OriginalApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

export enum ServicesEndpoints {
  rfExchange = 'rf-exchange',
  rfPairs = 'refinery-finance-pairs',
  snapshot = 'snapshot',
}

const isProduction = false;

const BASE_THE_GRAPH_ROCK_AND_BLOCK_URI = 'https://api.thegraph.com/subgraphs/name/rock-n-block/';

// @see https://github.com/apollographql/apollo-client/issues/84#issuecomment-763833895
// @see https://www.apollographql.com/docs/react/api/link/introduction/#providing-to-apollo-client
const rfExchangeGql = new HttpLink({
  uri: `${BASE_THE_GRAPH_ROCK_AND_BLOCK_URI}${ServicesEndpoints.rfExchange}`,
});
const rfPairsGql = new HttpLink({
  uri: `${BASE_THE_GRAPH_ROCK_AND_BLOCK_URI}${ServicesEndpoints.rfPairs}`,
});
const snapshotGql = new HttpLink({
  uri: `https://${isProduction ? 'hub' : 'testnet'}.${ServicesEndpoints.snapshot}.org/graphql`,
});

// TODO: How to handle multi endpoints in the application?
export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().serviceName === ServicesEndpoints.rfPairs,
    rfPairsGql,
    ApolloLink.split(
      (operation) => operation.getContext().serviceName === ServicesEndpoints.snapshot,
      snapshotGql,
      rfExchangeGql,
    ),
  ),
  cache: new InMemoryCache(),
});

interface IContextServiceName {
  context: { serviceName: ServicesEndpoints };
}

export const ApolloProvider: React.FC = ({ children }) => {
  return <OriginalApolloProvider client={apolloClient}>{children}</OriginalApolloProvider>;
};

export const getRfPairsContext = (): IContextServiceName => ({
  context: { serviceName: ServicesEndpoints.rfPairs },
});
export const getSnapshotContext = (): IContextServiceName => ({
  context: { serviceName: ServicesEndpoints.snapshot },
});
