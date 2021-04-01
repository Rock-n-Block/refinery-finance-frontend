import React from 'react';

import { ImgWebp } from '../components/shared/ImgWebp/ImgWebp';

import './App.scss';

import picture from '../assets/img/space.jpg';
import pictureWebp from '../assets/img/space.webp';

export const AppView = (): React.ReactElement => {
  return (
    <div>
      <ImgWebp loading="lazy" src={picture} srcWebp={pictureWebp} alt="Space" />
    </div>
  );
};
