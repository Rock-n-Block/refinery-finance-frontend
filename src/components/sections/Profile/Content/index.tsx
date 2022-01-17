import { FC, useCallback, useEffect, useState } from 'react';
import { RadioChangeEvent } from 'antd';

import TokenIcon from '@/assets/img/sections/profile/token-icon.svg';
import { RadioGroup } from '@/components/atoms';
import { IProfileCard } from '@/types';

/* eslint-disable react/react-in-jsx-scope */
import { Card } from '../index';

import './Content.scss';

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

const PAGES = [
  { text: 'NFTs', value: 1 },
  { text: 'Achivements', value: 2 },
];

const MODES = [
  { text: 'Items', value: 1 },
  { text: 'Activity', value: 2 },
];

const Content: FC = () => {
  const [NftData, setNftData] = useState<IProfileCard[]>(ITEMS);
  const [achiveData] = useState<string>('Lorem ipsum'); // TODO setAchiveData
  const [contentPage, setContentPage] = useState(1);
  const [nftMode, setNftMode] = useState(1);

  const handleChangeContentPage = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setContentPage(value);
  };

  const handleChangeMode = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setNftMode(value);
  };

  const handleChangeNftData = useCallback(() => {
    setNftData(nftMode === 1 ? ITEMS : ACTIVITY);
  }, [nftMode]);

  useEffect(() => {
    handleChangeNftData();
  }, [handleChangeNftData]);

  return (
    <div className="profile-content">
      <div className="profile-content__page">
        <RadioGroup
          value={contentPage}
          onChange={handleChangeContentPage}
          items={PAGES}
          className="profile-content__page-radio"
        />
      </div>
      <div className="profile-content__body">
        {contentPage === 1 ? (
          <>
            <RadioGroup
              items={MODES}
              value={nftMode}
              onChange={handleChangeMode}
              className="profile-content__body__mode"
            />
            <div className="profile-content__body__grid">
              {NftData.map(({ title, name, value, tokenIcon }) => {
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
          </>
        ) : (
          <div className="profile-content__body__grid">{achiveData}</div>
        )}
      </div>
    </div>
  );
};

export default Content;
