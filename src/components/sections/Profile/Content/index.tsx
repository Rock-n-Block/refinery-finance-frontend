import { FC, useCallback, useEffect, useState } from 'react';
import { RadioChangeEvent } from 'antd';

import TokenIcon from '@/assets/img/sections/profile/token-icon.svg';
import { RadioGroup, SortSelect } from '@/components/atoms';
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
  { text: 'NFTs', value: 'nft' },
  { text: 'Achivements', value: 'achivs' },
];

const MODES = [
  { text: 'Items', value: 'items' },
  { text: 'Activity', value: 'activity' },
];

const SORT_OPT = ['Hot', 'Ne hot', 'Ochen hot'];

const Content: FC = () => {
  const [NftData, setNftData] = useState<IProfileCard[]>(ITEMS);
  const [achiveData] = useState<string>('Lorem ipsum'); // TODO setAchiveData
  const [contentPage, setContentPage] = useState('nft');
  const [nftMode, setNftMode] = useState('items');

  const handleChangeContentPage = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setContentPage(value);
  };

  const handleChangeMode = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setNftMode(value);
  };

  const handleChangeNftData = useCallback(() => {
    setNftData(nftMode === 'items' ? ITEMS : ACTIVITY);
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
        {contentPage === 'nft' && (
          <>
            <div className="profile-content__body__controls">
              <RadioGroup
                items={MODES}
                value={nftMode}
                onChange={handleChangeMode}
                className="profile-content__body__controls__mode"
              />
              <SortSelect label="Sort by" sortOptions={SORT_OPT} />
            </div>
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
        )}
        {contentPage === 'achivs' && (
          <div className="profile-content__body__grid">{achiveData}</div>
        )}
      </div>
    </div>
  );
};

export default Content;
