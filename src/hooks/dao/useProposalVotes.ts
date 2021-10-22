import { useCallback, useEffect, useState } from 'react';
import EthDater from 'ethereum-block-by-date';

import {
  fetchUserBalancesByBlock,
  selectTotalUserBalancesByBlock,
} from '@/services/api/refinery-finance-pairs';
import {
  IGetProposalVotesResponse,
  IProposalVote,
  IProposalVoteWithVotingPower,
  useGetProposalVotes,
} from '@/services/api/snapshot.org/hooks';
import { metamaskService } from '@/services/MetamaskConnect';
import { clog } from '@/utils/logger';

const selectVotersAddresses = (data: IGetProposalVotesResponse) => {
  return data.votes.map((item) => item.voter);
};

export const useProposalVotes = (
  proposalId?: string,
): {
  votes: IProposalVoteWithVotingPower[];
  proposalVotesLoading: boolean;
  votingPowersLoading: boolean;
  updateProposalVotes: () => void;
} => {
  const {
    getProposalVotes,
    options: [, { loading: proposalVotesLoading, data: proposalVotesData }],
  } = useGetProposalVotes({
    fetchPolicy: 'network-only',
  });

  clog('useGetProposalVotes', proposalVotesLoading, proposalVotesData);

  const updateProposalVotes = useCallback(() => {
    if (proposalId) {
      getProposalVotes(proposalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId, getProposalVotes]);

  useEffect(() => {
    updateProposalVotes();
  }, [updateProposalVotes]);

  const [votes, setVotes] = useState<IProposalVoteWithVotingPower[]>([]);
  const [votingPowersLoading, setVotingPowersLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // is just to prevent error executing requests
    // and setting new state on unloaded component
    if (!proposalVotesLoading && proposalVotesData) {
      setVotingPowersLoading(true);
      const mapAddressToVoteData = proposalVotesData.votes.reduce(
        (acc: Record<string, IProposalVote>, currentItem) => {
          const voter = currentItem.voter.toLowerCase();
          acc[voter] = {
            ...currentItem,
            voter,
          };
          return acc;
        },
        {},
      );
      const addresses = selectVotersAddresses(proposalVotesData);
      // console.log(addresses, mapAddressToVoteData);
      // const addresses = [
      //   '0x945318935109de2c621C31900Cc22751492f327d',
      // ];
      //   '0x5aD5be12B7030689Dc425FdC5b65403C14C4B352',
      // const block = 27723969;

      const doAsyncWork = async () => {
        const ethBlockByDate = new EthDater(metamaskService.web3Provider);
        const blocksWhereWereVotesRaw = await Promise.allSettled(
          proposalVotesData.votes.map(({ created }) => {
            return ethBlockByDate.getDate(created * 1e3);
          }),
        );
        const blockWhereWereVotes = blocksWhereWereVotesRaw.map((item) => {
          return item.status === 'fulfilled' ? item.value.block : null;
        });
        const usersBalancesRaw = await fetchUserBalancesByBlock(addresses, blockWhereWereVotes);
        const totalUserBalancesByBlock = selectTotalUserBalancesByBlock(usersBalancesRaw);

        if (isMounted) {
          setVotes(
            totalUserBalancesByBlock.map((item) => {
              const voteData = mapAddressToVoteData[item.id];
              return {
                ...voteData,
                votingPower: item.TotalBalance,
              };
            }),
          );
        }
      };

      doAsyncWork().finally(() => {
        if (isMounted) {
          setVotingPowersLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [proposalVotesData, proposalVotesLoading]);

  return { votes, proposalVotesLoading, votingPowersLoading, updateProposalVotes };
};
