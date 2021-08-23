import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';

import './Dao.scss';

// import { DaoListItemsList } from '@/components/sections/DaoList';
import exampleAvatarPng from '@/assets/img/REMOVE_ME-avatar.png';
import Button from '@/components/atoms/Button';
import { DaoPreview } from '@/components/sections/Dao';

const mockData = {
  id: '1',
  title: 'DeFi Education Fund',
  status: 'active',
  text: `<div>
  <strong>Dear community,</strong>
  <br />
  <p>
    Last month we started a workshop to further refine and solidify our Vision, Mission
    and Values as a DAO. We had great participation from the workshop and everyone
    continued to share their thoughts and edits through calls and discord messages.
    Below is the distilled output from that event.
  </p>
  <br />
  <p>
    This post aims to formalize the Mission, Vision, and Values through a vote on
    snapshot.
  </p>
  <br />
  <p>Thank you!</p>
  <br />
  <strong>Vision:</strong>
  <p>
    To enable every person in the world the ability to create, access, and monetize
    digital items.
  </p>
  <br />
  <strong>Mission:</strong>
  <p>
    To empower builders to easily innovate by creating the building blocks needed for
    them to succeed, while fostering a collaborative and positive-sum environment that
    is fair, transparent, and enriching.
  </p>
  <br />
  <strong>Values:</strong>
  <p>
    As a DAO, Integrity is our core value. We expect our members to embody upright moral
    character both in the communities we inhabit and in our personal lives.
  </p>
  <br />
  <strong>Personal:</strong>
  <br />
  <p>
    A Learning Mindset - We have a hunger to learn. We learn from our mistakes and our
    successes. We believe that there is always room to grow and improve.
  </p>
  <p>
    Boldness - We are not afraid to fail. We take risks to test our ideas and
    assumptions.
  </p>
  <p>
    Openness - We are welcoming, accepting, and supportive to our fellow humans. We
    value constructive criticism as this allows us to better ourselves.
  </p>
  <p>Fun - We don’t take ourselves too seriously.</p>
  <p>Honesty - We are transparent with each other. We are trustworthy.</p>
</div>`,
  additionalInformation: [
    {
      id: 1,
      option: 'Strategie(s)',
      value: '',
    },
    {
      id: 2,
      option: 'Author',
      value: 'Noah Core',
    },
    {
      id: 3,
      option: 'IPFS',
      value: '#QmTsXB',
    },
    {
      id: 4,
      option: 'Voting system',
      value: 'Single choice voting',
    },
    {
      id: 5,
      option: 'Start date',
      value: 'Aug 10, 2021, 10:00 PM',
    },
    {
      id: 6,
      option: 'End date',
      value: 'Aug 15, 2021, 10:00 PM',
    },
    {
      id: 7,
      option: 'Snapshot',
      value: '12,999,695',
    },
  ],
  votes: [
    {
      person: {
        avatar: '/static/media/REMOVE_ME-avatar.png',
        name: 'Eric Arsenault',
      },
      chosenOption: 'Vote FOR',
      value: '651.6',
      valueCategory: 'Token',
    },
    {
      person: {
        avatar: '/assets/img/REMOVE_ME-avatar.png',
        name: 'Eric Arsenault',
      },
      chosenOption: 'Vote AGAINST',
      value: '131.2',
      valueCategory: 'Token',
    },
    {
      person: {
        avatar: '/assets/img/REMOVE_ME-avatar.png',
        name: 'Eric Arsenault',
      },
      chosenOption: 'Vote FOR',
      value: '651.6',
      valueCategory: 'Token',
    },
    {
      person: {
        avatar: '/public/assets/img/REMOVE_ME-avatar.png',
        name: 'Eric Arsenault',
      },
      chosenOption: 'Vote AGAINST',
      value: '131.2',
      valueCategory: 'Token',
    },
    {
      person: {
        avatar: '/assets/img/REMOVE_ME-avatar.png',
        name: 'Eric Arsenault',
      },
      chosenOption: 'Vote FOR',
      value: '651.6',
      valueCategory: 'Token',
    },
    {
      person: {
        avatar: '/assets/img/REMOVE_ME-avatar.png',
        name: 'Eric Arsenault',
      },
      chosenOption: 'Vote AGAINST',
      value: '131.2',
      valueCategory: 'Token',
    },
  ],
};

const Dao: React.FC = () => {
  const { id, status, title, text, additionalInformation, votes } = mockData;
  const [votedOption, setVotedOption] = useState(-1);

  useEffect(() => {
    console.log(`retrieve data by id=${id}`);
  }, [id]);
  return (
    <main className="dao">
      <div className="row">
        <div className="dao__content box-purple-l">
          <DaoPreview />
          <div className="dao__wrapper">
            <div className="dao__title text-purple text-bold">{title}</div>
            <section className="section document dao__section box-shadow box-white">
              <div className="document__wrapper">
                <div className="document__column">
                  <div className="document__text" dangerouslySetInnerHTML={{ __html: text }} />
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
                  <section className="document__information information">
                    <div className="information__title text-purple text-bold text-smd">
                      Information
                    </div>
                    <div className="information__content">
                      <ul>
                        {additionalInformation.map((item) => {
                          return (
                            <li key={item.id} className="information__content-row">
                              <div className="information__option-name text-purple">
                                {item.option}
                              </div>
                              <div className="information__option-value">{item.value}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </section>

                  <section className="document__information information">
                    <div className="information__title text-purple text-bold text-smd">
                      Current results
                    </div>
                    <div className="information__content">
                      <ul className="votes-progression">
                        <li className="votes-progression__item">
                          <div className="votes-progression__captions text-purple">
                            <div className="votes-progression__option">Vote FOR1.64k RARI</div>
                            <div className="votes-progression__value">100%</div>
                          </div>
                          <div className="votes-progression__progress-bar votes-progression__progress-bar_active" />
                        </li>
                        <li className="votes-progression__item">
                          <div className="votes-progression__captions text-purple">
                            <div className="votes-progression__option">Author</div>
                            <div className="votes-progression__value">0%</div>
                          </div>
                          <div className="votes-progression__progress-bar" />
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
            </section>

            <section className="section dao__section box-shadow box-white">
              <div className="section__wrapper">
                <div className="section__header text-purple text-slg text-bold">Cast your vote</div>
                <div className="section__body">
                  <div className="buttons-group">
                    <Button
                      className={classNames('buttons-group__button', {
                        'buttons-group__button_active': votedOption === 0,
                      })}
                      colorScheme="outline-purple"
                      size="smd"
                      onClick={() => setVotedOption(0)}
                    >
                      Vote for
                    </Button>
                    <Button
                      className={classNames('buttons-group__button', {
                        'buttons-group__button_active': votedOption === 1,
                      })}
                      colorScheme="outline-purple"
                      size="smd"
                      onClick={() => setVotedOption(1)}
                    >
                      Vote Against
                    </Button>
                    <Button className="buttons-group__submit-button" colorScheme="purple">
                      <span className="text-bold">Vote</span>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="section dao__section box-shadow box-white">
              <div className="section__wrapper">
                <div className="section__header text-purple text-slg text-bold">Votes</div>
                <div className="section__body">
                  <ul className="votes-list">
                    {votes.map((item, index) => {
                      return (
                        <li
                          key={JSON.stringify(item) + String(index)}
                          className="votes-list__item text-smd"
                        >
                          <div className="votes-list__avatar">
                            <img src={exampleAvatarPng} alt="avatar" />
                          </div>
                          <div className="votes-list__name">{item.person.name}</div>
                          <div className="votes-list__vote">{item.chosenOption}</div>
                          <div className="votes-list__tokens">
                            <div className="votes-list__tokens-value text-purple">{item.value}</div>
                            <div className="votes-list__tokens-name">{item.valueCategory}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Dao;
