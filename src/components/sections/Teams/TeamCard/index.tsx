import React from 'react';
import cn from 'classnames';

import { Button } from '../../../atoms';

import './TeamCard.scss';

import WinImg from '@/assets/img/icons/win-cup.svg';
import MemberImg from '@/assets/img/icons/member.svg';

interface ITeamCard {
  place: number;
  name: string;
  details: string;
  members: number;
  win: number;
  img: string;
  id: number | string;
}

const TeamCard: React.FC<ITeamCard> = ({ place, name, details, win, members, id, img }) => {
  return (
    <div className="teams-card box-shadow box-f-ai-c box-f-jc-sb">
      <div className="box-f">
        <div
          className={cn('teams-card__numb box-f-c', {
            active: place === 1,
          })}
        >
          <span className="text-bold text-smd">{place}.</span>
        </div>
        <div>
          <div className="text-purple text-bold text-slg">{name}</div>
          <div className="teams-card__details text-smd text-purple">{details}</div>
          <div className="box-f-ai-c">
            <div className="teams-card__elem box-f-ai-c">
              <img src={WinImg} alt="" />
              <span className="text-bold text-slg text-purple">{win}</span>
            </div>
            <div className="teams-card__elem box-f-ai-c">
              <img src={MemberImg} alt="" />
              <span className="text-bold text-slg text-purple">{members}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="box-f-ai-c">
        <Button colorScheme="outline-purple" size="smd" link={`/teams/${id}`}>
          <span>See more</span>
        </Button>
        <div className="teams-card__img">
          <img src={img} alt="" />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
