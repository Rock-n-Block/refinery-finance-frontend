import React from 'react';

import picture from '@/assets/img/space.jpg';
import { ImgWebp } from '@/components/shared/ImgWebp/ImgWebp';

export const FirstPage = (): React.ReactElement => {
  return (
    <div>
      <p>First page works</p>

      <ImgWebp loading="lazy" src={picture} alt="Space" />
    </div>
  );
};
