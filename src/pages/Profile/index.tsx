/* eslint-disable react/react-in-jsx-scope */
import { VFC } from 'react';

import Preview from '../../components/sections/Profile/Preview';

import './Profile.scss';

const Profile: VFC = () => {
  return (
    <div className="profile">
      <Preview />
    </div>
  );
};

export default Profile;
