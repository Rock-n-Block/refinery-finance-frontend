/* eslint-disable react/react-in-jsx-scope */
import { VFC } from 'react';

import { Preview } from '@/components/sections/Profile/index';

import './Profile.scss';

const Profile: VFC = () => {
  return (
    <div className="profile">
      <Preview />
    </div>
  );
};

export default Profile;
