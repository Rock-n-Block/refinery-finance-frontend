import React, { useCallback, useEffect, useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

// import BnbImg from '@/assets/img/currency/bnb.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import TumerImg from '@/assets/img/icons/tumer.svg';
import EmptyImg from '@/assets/img/sections/profile/empty.svg';
import { Button, RadioGroup } from '@/components/atoms';
import { IS_PRODUCTION } from '@/config';
import { onGetGraphSwaps } from '@/services/api/swaps';
import { useMst } from '@/store';

import './Content.scss';

const PAGES = [{ text: 'Transactions', value: 'trx' }];

const Content: React.FC = observer(() => {
  const { user } = useMst();
  const [contentPage, setContentPage] = useState(PAGES[0].value);
  const [trxs, setTrxs] = useState<any>();

  const handleChangeContentPage = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setContentPage(value);
  };

  const handelGetSwaps = useCallback(async () => {
    if (user.address) {
      const result = await onGetGraphSwaps(user.address);
      setTrxs(result);
    }
  }, [user.address]);

  useEffect(() => {
    handelGetSwaps();
  }, [handelGetSwaps]);

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
        {trxs && trxs.swaps.length ? (
          <div className="profile-content__table">
            <div className="profile-content__table__head profile-content__table__row text-purple text-bold text-smd hidden-mobile">
              <div className="profile-content__table__head__item">Swap</div>
              <div className="profile-content__table__head__item">Amount 1</div>
              <div className="profile-content__table__head__item">Amount 2</div>
              <div className="profile-content__table__head__item">Data</div>
              <div className="profile-content__table__head__item" />
            </div>
            {trxs.swaps.length &&
              trxs.swaps.map((swap: any) => (
                <div key={swap.transaction.id} className="profile-content__table__row">
                  <div className="profile-content__table__content__item text-smd">
                    <div className="text-purple text-bold text-smd hidden-desktop">Swap</div>
                    {swap.pair.token0.symbol} & {swap.pair.token1.symbol}
                  </div>
                  <div className="profile-content__table__content__item">
                    <div className="text-purple text-bold text-smd hidden-desktop">Amount 1</div>
                    <div className="text-smd">
                      {(+swap.amount0In !== 0 ? +swap.amount0In : +swap.amount1In).toFixed(2)}
                    </div>
                  </div>
                  <div className="profile-content__table__content__item">
                    <div className="text-purple text-bold text-smd hidden-desktop">Amount 2</div>
                    <div className="text-smd">
                      {(+swap.amount1Out !== 0 ? +swap.amount1Out : +swap.amount0Out).toFixed(2)}
                    </div>
                  </div>
                  <div className="profile-content__table__content__item text-smd">
                    <div className="text-purple text-bold text-smd hidden-desktop">Data</div>
                    {/* <div className="">{new Date(+swap.timestamp * 1000).toUTCString()}</div> */}
                    <div className="">{moment(+swap.timestamp * 1000).format('MMMM Do YYYY')}</div>
                    {/* <div className="">{trx.data}</div> */}
                    <img src={TumerImg} alt="" />
                  </div>
                  <Button
                    colorScheme="outline-purple"
                    size="smd"
                    className="profile-content__table__content__item__btn"
                  >
                    <a
                      href={
                        IS_PRODUCTION
                          ? `https://etherscan.io/tx/${swap.transaction.id}`
                          : `https://kovan.etherscan.io/tx/${swap.transaction.id}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Details</span>
                      <img src={OpenLinkImg} alt="" />
                    </a>
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
});

export default Content;
