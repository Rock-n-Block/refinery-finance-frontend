import React, { useState } from 'react';
import { RadioChangeEvent } from 'antd';

import { RadioGroup, Button } from '@/components/atoms';

import './Content.scss';

import BnbImg from '@/assets/img/currency/bnb.svg';
import TumerImg from '@/assets/img/icons/tumer.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import EmptyImg from '@/assets/img/sections/profile/empty.svg';

const PAGES = [{ text: 'Transactions', value: 'trx' }];

const trxs = [
  {
    method: 'Swap',
    from: {
      amount: 951.5,
      usd: 0,
    },
    to: {
      amount: 951.5,
      usd: 0,
    },
    text: 'text',
    data: '2022-07-06',
  },
  {
    method: 'Swap',
    from: {
      amount: 951.5,
      usd: 0,
    },
    to: {
      amount: 951.5,
      usd: 0,
    },
    text: 'text',
    data: '2022-07-06',
  },
];
// const trxs: any = [];

const Content: React.FC = () => {
  const [contentPage, setContentPage] = useState(PAGES[0].value);

  const handleChangeContentPage = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setContentPage(value);
  };

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
        {trxs.length ? (
          <div className="profile-content__table">
            <div className="profile-content__table__head profile-content__table__row text-purple text-bold text-smd">
              <div className="profile-content__table__head__item" />
              <div className="profile-content__table__head__item">Head</div>
              <div className="profile-content__table__head__item">Head</div>
              <div className="profile-content__table__head__item">Head</div>
              <div className="profile-content__table__head__item">Data</div>
              <div className="profile-content__table__head__item" />
            </div>
            {trxs.map((trx: any) => (
              <div className="profile-content__table__row">
                <div className="profile-content__table__content__item text-smd">{trx.method}</div>
                <div className="profile-content__table__content__item">
                  <img src={BnbImg} alt="" />
                  <div className="">
                    <div className="text-smd">{trx.from.amount}</div>
                    <div className="text-gray text-ssm">{trx.from.usd} USD</div>
                  </div>
                </div>
                <div className="profile-content__table__content__item">
                  <img src={BnbImg} alt="" />
                  <div className="">
                    <div className="text-smd">{trx.to.amount}</div>
                    <div className="text-gray text-ssm">{trx.to.usd} USD</div>
                  </div>
                </div>
                <div className="profile-content__table__content__item text-smd text-purple text-500">
                  {trx.text}
                </div>
                <div className="profile-content__table__content__item text-smd">
                  <div className="">{trx.data}</div>
                  <img src={TumerImg} alt="" />
                </div>
                <Button
                  colorScheme="outline-purple"
                  size="smd"
                  className="profile-content__table__content__item__btn"
                >
                  <span>Details</span>
                  <img src={OpenLinkImg} alt="" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="profile-content__empty">
            <img src={EmptyImg} alt="" />
            <div className="text-ssmd text-500">No recent transactions</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
