/* eslint-disable react/react-in-jsx-scope */
import { VFC } from 'react';

import { Preview, StepsForm } from '@/components/sections/CreateProfile/index';

import './CreateProfile.scss';

const CreateProfile: VFC = () => {
  return (
    <div className="create-profile">
      <Preview />
      <StepsForm />
    </div>
  );
};

export default CreateProfile;
