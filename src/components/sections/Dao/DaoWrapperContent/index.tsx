import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';

import { Skeleton } from '@/components/atoms';
import ReactMarkdown from '@/components/molecules/ReactMarkdown';
import { DaoInformation, DaoSection } from '@/components/sections/Dao';
import DaoProposalCastVote from '@/components/sections/Dao/DaoProposalCastVote';
import DaoProposalInformation from '@/components/sections/Dao/DaoProposalInformation';
import DaoProposalVotes, { IVote } from '@/components/sections/Dao/DaoProposalVotes';
import DaoProposalVotesResult from '@/components/sections/Dao/DaoProposalVotesResult';
import { tokens } from '@/config/tokens';
import { useProposalVotes } from '@/hooks/dao/useProposalVotes';
import { IProposal } from '@/services/api/snapshot.org/hooks';
import { useMst } from '@/store';
import { BIG_ZERO } from '@/utils/constants';

interface IDaoWrapperContentProps {
  proposal?: IProposal;
}

const DaoWrapperContentSkeleton: React.FC = React.memo(() => {
  return (
    <>
      <div className="dao__title text-purple text-bold">
        <Skeleton active title paragraph={false} />
      </div>
      <section className="section document dao__section box-shadow box-white">
        <div className="document__wrapper">
          <div className="document__column">
            <Skeleton active title={false} paragraph={{ rows: 10 }} />
          </div>
          <div className="document__column information-column text-ssm">
            <div className={classNames('document__status', 'btn', 'btn-ssm', 'text-ssmd')}>
              <Skeleton active title paragraph={false} />
            </div>
            <DaoInformation className="document__information" title="Information">
              <Skeleton active title={false} paragraph={{ rows: 6 }} />
            </DaoInformation>

            <DaoInformation className="document__information" title="Current results">
              <Skeleton active title={false} paragraph={{ rows: 2 }} />
            </DaoInformation>
          </div>
        </div>
      </section>

      <DaoSection className="dao__section" title="Cast your vote">
        <Skeleton active title={false} paragraph={{ rows: 2 }} />
      </DaoSection>

      <DaoSection className="dao__section" title="Votes">
        <Skeleton active title={false} paragraph={{ rows: 10 }} />
      </DaoSection>
    </>
  );
});

const DaoWrapperContent: React.FC<IDaoWrapperContentProps> = React.memo(({ proposal }) => {
  const { votes: votesRaw } = useProposalVotes(proposal?.id);
  const { user } = useMst();

  if (!proposal) return <DaoWrapperContentSkeleton />;

  const {
    id: proposalId,
    ipfs,
    title,
    author,
    body,
    choices,
    start,
    end,
    snapshot,
    state: status,
    type: votingSystem,
  } = proposal;

  let totalChoicesVotingPower = BIG_ZERO;

  console.log(votesRaw);

  const mapChoiceToTotalVotingPower = votesRaw.reduce(
    (acc, { choice: choiceIndex, votingPower }) => {
      const choice = choices[choiceIndex - 1];
      const totalVotingPower = acc[choice] ? new BigNumber(acc[choice].votingPower) : BIG_ZERO;
      acc[choice] = {
        votingPower: totalVotingPower.plus(votingPower),
      };
      totalChoicesVotingPower = totalChoicesVotingPower.plus(votingPower);
      return acc;
    },
    {} as Record<string, { votingPower: BigNumber }>,
  );

  const results = votesRaw.length
    ? choices.map((choice) => {
        const { votingPower } = mapChoiceToTotalVotingPower[choice] || { votingPower: BIG_ZERO };
        return {
          choice,
          votingPower,
          percents: votingPower.div(totalChoicesVotingPower).multipliedBy(100).toFixed(2),
        };
      })
    : [];

  const votes = votesRaw.map(({ id: voteId, voter, choice: choiceIndex, votingPower }) => {
    return {
      voteId,
      person: {
        address: voter,
      },
      choice: choices[choiceIndex - 1],
      votingPower,
    } as IVote;
  });

  const hasAlreadyVoted = votesRaw.some(({ voter }) => voter === user.address);

  return (
    <>
      <div className="dao__title text-purple text-bold">{title}</div>
      <section className="section document dao__section box-shadow box-white">
        <div className="document__wrapper">
          <div className="document__column">
            <ReactMarkdown className="document__text text-purple">{body}</ReactMarkdown>
          </div>
          <div className="document__column information-column text-ssm">
            <div
              className={classNames(
                'document__status',
                `document__status_${status}`,
                'btn',
                'btn-ssm',
                'text-ssmd',
              )}
            >
              {status}
            </div>
            <DaoInformation className="document__information" title="Information">
              <DaoProposalInformation
                ipfs={ipfs}
                author={author}
                start={start}
                end={end}
                snapshot={snapshot}
                votingSystem={votingSystem}
              />
            </DaoInformation>

            <DaoInformation className="document__information" title="Current results">
              {/* TODO: */}
              <DaoProposalVotesResult results={results} />
            </DaoInformation>
          </div>
        </div>
      </section>

      {status === 'active' && !hasAlreadyVoted && Boolean(votesRaw.length) && (
        <DaoSection className="dao__section" title="Cast your vote">
          <DaoProposalCastVote proposalId={proposalId} choices={choices} />
        </DaoSection>
      )}

      {status !== 'pending' && (
        <DaoSection className="dao__section" title="Votes">
          <DaoProposalVotes votes={votes} token={tokens.rp1} />
        </DaoSection>
      )}
    </>
  );
});

export default DaoWrapperContent;
