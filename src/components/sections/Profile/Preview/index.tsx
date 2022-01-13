/* eslint-disable react/react-in-jsx-scope */
import { FC, memo } from 'react';

import './Preview.scss';

const Preview: FC = memo(() => {
  return (
    <div className="profile-preview box-purple-l">
      <div className="profile-preview__box">
        <h1 className="profile-preview__title h1 text-white text-bold">Profile Setup</h1>
        <div className="profile-preview__subtitle box-f-fd-c">
          <span className="text-white">
            Show off your stats and collectibles with your unique profile
          </span>
          <span className="text-orange">Total cost: 1.5 token</span>
        </div>
      </div>
    </div>
  );
});

export default Preview;
