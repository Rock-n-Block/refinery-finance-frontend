import { metamaskService } from '../MetamaskConnect/index';

export const getBlockNumber = (): Promise<number> =>
  metamaskService.web3Provider.eth.getBlockNumber();
