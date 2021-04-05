import React from 'react';

import { ImgWebp } from '@/components/shared/ImgWebp/ImgWebp';

import './App.scss';

import picture from '../assets/img/space.jpg';

export const AppView = (): React.ReactElement => {
  return (
    <div>
      <ImgWebp loading="lazy" src={picture} alt="Space" />
    </div>
  );
};
