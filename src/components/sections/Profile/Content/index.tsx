import { FC, useState } from 'react';

import TokenIcon from '@/assets/img/sections/profile/token-icon.svg';
import { IProfileCard } from '@/types';

/* eslint-disable react/react-in-jsx-scope */
import { Card } from '../index';

import './Content.scss';
import { RadioGroup } from '@/components/atoms';
import { RadioChangeEvent } from 'antd';

const ITEMS: IProfileCard[] = Array(20)
  .fill('')
  .map(() => ({ title: 'Pancake Bunnies', name: 'Mixie v1', value: 0.0712, tokenIcon: TokenIcon }));

const ACTIVITY: IProfileCard[] = Array(5)
  .fill('')
  .map(() => ({
    title: 'Sushiswap Bunnies',
    name: 'Boobly v1',
    value: 12.1423,
    tokenIcon: TokenIcon,
  }));

const Content: FC = () => {
  const [mode, setChangeMode] = useState(1);

  const handleChangeMode = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setChangeMode(value);
  };

  return (
    <div className="profile-content">
      <RadioGroup
        items={[
          { text: 'Items', value: 1 },
          { text: 'Activity', value: 2 },
        ]}
        value={mode}
        onChange={handleChangeMode}
        className="profile-content__radio"
      />
      <div className="profile-content__body">
        {mode === 1 &&
          ITEMS.map(({ title, name, value, tokenIcon }) => {
            return (
              <Card
                key={Math.random()}
                title={title}
                name={name}
                value={value}
                tokenIcon={tokenIcon}
              />
            );
          })}
        {mode === 2 &&
          ACTIVITY.map(({ title, name, value, tokenIcon }) => {
            return (
              <Card
                key={Math.random()}
                title={title}
                name={name}
                value={value}
                tokenIcon={tokenIcon}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Content;
