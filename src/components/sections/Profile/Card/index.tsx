/* eslint-disable react/react-in-jsx-scope */
import { FC } from 'react';

import CardAvatar from '@/assets/img/sections/profile/card-avatar.svg';
import Img from '@/assets/img/sections/profile/token-icon.svg';
import { IProfileCard } from '@/types';

import './Card.scss';

const ProfileCard: FC<IProfileCard> = ({ title, name, value, tokenIcon }) => {
  return (
    <div className="profile-card">
      <img src={CardAvatar} alt="cardAvatar" />
      <div className="profile-card__body">
        <div className="profile-card__body-title">{title}</div>
        <div className="profile-card__body-name">{name}</div>
        <div className="profile-card__body-price">
          Lowest price
          <div className="profile-card__body-price__value">
            <img src={tokenIcon || Img} alt="icon" />
            <span>{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
