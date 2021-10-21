import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import exampleAvatarPng from '@/assets/img/REMOVE_ME-avatar.png';
import OpenLink from '@/components/atoms/OpenLink';
import { getScannerUrl } from '@/hooks/useScannerUrl';
import { getIpfsUrl } from '@/services/api/snapshot.org';
import { Precisions, Token } from '@/types';
import { addressShortener, getFullDisplayBalance, numberWithCommas } from '@/utils/formatters';

import './DaoProposalVotes.scss';

export interface IPerson {
  address: string;
  avatar?: string;
  name?: string;
}

export interface IVote {
  voteId: string;
  person: IPerson;
  choice: string;
  votingPower: string;
}

interface IDaoProposalVotesProps {
  votes: IVote[];
  token: Token;
}

const DaoProposalVotes: React.FC<IDaoProposalVotesProps> = ({ votes, token }) => {
  return (
    <ul className="votes-list">
      {votes.map((item) => {
        const {
          voteId,
          choice,
          person: { address, avatar, name },
          votingPower,
        } = item;

        const addressUrl = getScannerUrl(`address/${address}`);
        const tokensValue = getFullDisplayBalance({
          balance: new BigNumber(votingPower),
          decimals: token.decimals,
          displayDecimals: Precisions.shortToken,
        });
        return (
          <li key={voteId} className="votes-list__item text-smd">
            {Boolean(avatar) && (
              <div className="votes-list__avatar">
                <img
                  className="votes-list__avatar-image"
                  src={avatar || exampleAvatarPng}
                  alt="avatar"
                />
              </div>
            )}
            <div className="votes-list__name">
              <OpenLink
                className="text-smd text-purple"
                href={addressUrl}
                text={name || addressShortener(address)}
                iconClassName="votes-list__link-icon"
              />
            </div>
            <div className="votes-list__vote">{choice}</div>
            <div className="votes-list__tokens">
              <OpenLink
                className="votes-list__tokens-value text-smd text-purple"
                iconClassName="votes-list__link-icon"
                href={getIpfsUrl(voteId)}
                text={numberWithCommas(Number(tokensValue))}
              />
              <div className="votes-list__tokens-name">{token.symbol}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default DaoProposalVotes;
