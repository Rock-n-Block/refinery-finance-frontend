import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getBaseScannerUrl } from '@/utils';

export const useScannerUrl = (postfix: string): string => {
  const { metamaskService } = useWalletConnectorContext();
  const baseScannerUrl = getBaseScannerUrl(metamaskService.usedChain);
  return `${baseScannerUrl}/${postfix}`;
};
