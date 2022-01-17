/* eslint-disable react/react-in-jsx-scope */
import { VFC } from 'react';
import { observer } from 'mobx-react-lite';

import Avatar from '@/assets/img/sections/profile/avatar.svg';
import { Button } from '@/components/atoms';
import { useMst } from '@/store';

import './Preview.scss';

const Preview: VFC = observer(() => {
  const { user } = useMst();
  return (
    <div className="profile-preview box-purple-l">
      <div className="profile-preview__back">
        <img src={Avatar} alt="avatar" className="profile-preview__back-avatar" />
      </div>
      <div className="profile-preview__content">
        <div className="profile-preview__content-address">
          <span>
            {user.address &&
              `${user.address.substr(0, 6)}...${user.address.substr(user.address.length - 3, 3)}`}
          </span>
          <Button colorScheme="yellow" className="profile-preview__content-address-btn">
            Activate Profile
          </Button>
        </div>
        <div className="profile-preview__content-params">
          <ul className="profile-preview__content-params__values">
            <li className="text-purple">NFT Collected</li>
            <li className="text-purple">Points</li>
            <li className="text-purple">Achievements</li>
            <li className="text-black text-lg">9</li>
            <li className="text-black text-lg">-</li>
            <li className="text-black text-lg">2</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default Preview;
