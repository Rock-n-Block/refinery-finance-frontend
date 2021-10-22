import { useCallback } from 'react';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { useSnapshotService } from '@/services/api/snapshot.org';
import { ISnapshotSpace } from '@/services/api/snapshot.org/spaces';
// import { strategies } from '@/services/api/snapshot.org/strategies';
import { useMst } from '@/store';
import { clogError } from '@/utils/logger';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCastVote = ({
  onSuccessTx,
  onStartTx,
  onEndTx,
}: {
  onSuccessTx: () => void;
  onStartTx: () => void;
  onEndTx: () => void;
}) => {
  const { user } = useMst();
  const { snapshotClient, provider } = useSnapshotService();

  const vote = useCallback(
    async (proposalId: string, choices: string[], chosenOption: number) => {
      if (!proposalId) {
        return errorNotification('Error', 'Invalid IPFS hash or ID!');
      }

      // votingPower: '5',
      // strategies: [strategies.erc20WithBalance],

      const msg = {
        choice: chosenOption,
        proposal: proposalId,
        // metadata: {},
      };

      onStartTx();

      try {
        await snapshotClient.vote(provider, user.address, ISnapshotSpace.CAKE_ETH_SPACE, msg);
        // chosenOption starts from 1, 2, 3... (not from zero)
        onSuccessTx();
        successNotification(`Success', 'Successfully voted for ${choices[chosenOption - 1]}!`);
      } catch (error: any) {
        clogError(error);
        const errorMessage = error?.error_description ? error.error_description : error.message;
        errorNotification('Error', errorMessage);
      } finally {
        onEndTx();
      }

      // just to prevent eslint-error
      return null;
    },
    [snapshotClient, provider, user.address, onSuccessTx, onStartTx, onEndTx],
  );

  return { vote };
};
