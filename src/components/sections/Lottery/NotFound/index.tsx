import React from 'react';

import './NotFound.scss';

import { ReactComponent as LupaImg } from '../../../../assets/img/icons/lupa.svg';

const NotFound: React.FC = () => {
  return (
    <div className="lottery-not-found box-shadow box-white box-f box-f-fd-c box-f-ai-c">
      <LupaImg />
      <div className="text-md text-purple lottery-not-found__text">No Results Found</div>
    </div>
  );
};

export default NotFound;
