import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';

import { metamaskService } from '@/services/MetamaskConnect';

const TESTNET_SNAPSHOT_HUB = 'https://testnet.snapshot.org';
const IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs';

export const snapshotClient = new snapshot.Client(TESTNET_SNAPSHOT_HUB);
export const provider = new Web3Provider(metamaskService.web3Provider.currentProvider as any);

export const getIpfsUrl = (ipfsHash: string): string => {
  return `${IPFS_GATEWAY}/${ipfsHash}`;
};

export const useSnapshotService = (): {
  snapshotClient: typeof snapshotClient;
  provider: typeof provider;
} => {
  return { snapshotClient, provider };
};
