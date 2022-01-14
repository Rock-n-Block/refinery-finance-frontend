import { FC } from 'react';

import { Card } from '../index';

import './Content.scss';

/* eslint-disable react/react-in-jsx-scope */
const Content: FC = () => {
  return (
    <div className="profile-content">
      {Array(20)
        .fill('')
        .map(() => {
          return (
            <Card key={Math.random()} title="Pancake Bunnies" name="Mixie v1" value={0.0712} />
          );
        })}
    </div>
  );
};

export default Content;
