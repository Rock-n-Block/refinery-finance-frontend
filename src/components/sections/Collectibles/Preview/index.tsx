import React from 'react';

import './Preview.scss';

import Bg2 from '../../../../assets/img/sections/collectibles/bg-2.svg';
import Bg3 from '../../../../assets/img/sections/collectibles/bg-3.svg';

const Preview: React.FC = () => {
  return (
    <div className="collectibles-preview">
      <img src={Bg2} alt="" className="collectibles-preview__img collectibles-preview__img-1" />
      <img src={Bg3} alt="" className="collectibles-preview__img collectibles-preview__img-2" />
      <h1 className="collectibles-preview__title h1-md text-bold text-white">Collectibles</h1>
    </div>
  );
};

export default Preview;
