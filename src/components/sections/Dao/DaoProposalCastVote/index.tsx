import React, { useState } from 'react';
import classNames from 'classnames';

import Button from '@/components/atoms/Button';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { useSnapshotService } from '@/services/api/snapshot.org';
import { ISnapshotSpace } from '@/services/api/snapshot.org/spaces';
// import { strategies } from '@/services/api/snapshot.org/strategies';
import { useMst } from '@/store';
import { clogError } from '@/utils/logger';

import './DaoProposalCastVote.scss';

interface IDaoProposalCastVoteProps {
  proposalId: string;
  choices: string[];
}

const DaoProposalCastVote: React.FC<IDaoProposalCastVoteProps> = ({ proposalId, choices }) => {
  const [pendingTx, setPendingTx] = useState(false);
  const [votedOption, setVotedOption] = useState(-1);
  const { user } = useMst();

  const { snapshotClient, provider } = useSnapshotService();

  const votingDisabled = pendingTx || votedOption === -1;

  const vote = async () => {
    if (!proposalId) {
      return errorNotification('Error', 'Invalid IPFS hash or ID!');
    }

    // votingPower: '5',
    // strategies: [strategies.erc20WithBalance],

    const msg = {
      choice: votedOption,
      proposal: proposalId,
      // metadata: {},
    };

    setPendingTx(true);

    try {
      await snapshotClient.vote(provider, user.address, ISnapshotSpace.CAKE_ETH_SPACE, msg);
      successNotification(`Success', 'Successfully voted for ${choices[votedOption - 1]}!`);
    } catch (error: any) {
      clogError(error);
      const errorMessage = error?.error_description ? error.error_description : error.message;
      errorNotification('Error', errorMessage);
    } finally {
      setPendingTx(false);
    }

    // just to prevent eslint-error
    return null;
  };

  return (
    <div className="buttons-group">
      {choices.map((choice, index) => {
        const choiceIndex = index + 1;
        return (
          <Button
            key={choice + String(index)}
            className={classNames('buttons-group__button', {
              'buttons-group__button_active': votedOption === choiceIndex,
            })}
            colorScheme="outline-purple"
            size="smd"
            onClick={() => setVotedOption(choiceIndex)}
          >
            {choice}
          </Button>
        );
      })}
      <Button
        className="buttons-group__submit-button"
        loading={pendingTx}
        disabled={votingDisabled}
        colorScheme="purple"
        onClick={votingDisabled ? undefined : vote}
      >
        <span className="text-bold">Vote</span>
      </Button>
    </div>
  );
};

export default DaoProposalCastVote;
