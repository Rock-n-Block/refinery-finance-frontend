import { contracts, tokens } from '@/config';
import { TTokenKey } from '@/config/tokens';
import { Address } from '@/types';

import { metamaskService } from '../MetamaskConnect';

export type IContract = keyof typeof contracts;

export interface IContractData {
  ADDRESS: string;
  ABI: [];
}

/**
 * @returns [address, AbiItem[]]
 */
export const getContractData = (name: IContract): [string, IContractData['ABI']] => {
  const contractData = contracts[name] as IContractData;
  return [contractData.ADDRESS, contractData.ABI];
};

export const getContractAddress = (name: IContract) => {
  return (contracts[name] as IContractData).ADDRESS;
};

export const getContract = (name: IContract) => {
  const [address, abi] = getContractData(name) as [string, []];
  return metamaskService.getContract(address, abi);
};

// export const getRefineryVaultContractMethodCallFee = () => {
//   const contract = getContract('REFINERY_VAULT');
//   return contract.methods.callFee();
// };

export const getAddress = (address: Address): string => {
  const chainId = metamaskService.usedChain;
  return address[Number(chainId)];
};

export const getTokenData = (name: TTokenKey) => {
  return {
    ...tokens[name],
    address: getAddress(tokens[name].address),
  };
};
