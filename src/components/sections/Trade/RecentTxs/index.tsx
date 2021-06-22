import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { Scrollbar } from 'react-scrollbars-custom';

import { useMst } from '../../../../store';
import { Button } from '../../../atoms';

import './RecentTxs.scss';

import CrossImg from '../../../../assets/img/icons/cross.svg';
import BnbImg from '@/assets/img/currency/bnb.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';

const RecentTxs: React.FC = observer(() => {
  const history = useHistory();
  const { user } = useMst();
  const txs = [
    {
      type: 'Swap',
      from: {
        value: 100,
        symbol: 'BNB',
        img: BnbImg,
      },
      to: {
        value: 200,
        symbol: 'BNB',
        img: BnbImg,
      },
    },
  ];
  const handleClose = (): void => {
    history.goBack();
  };
  return (
    <div className="exchange recent-txs box-shadow box-white">
      <div className="box-f-jc-sb box-f-ai-c">
        <div className="text-med text-purple text-md">Recent transactions</div>
        <div
          className="exch-settings__close"
          onClick={handleClose}
          onKeyDown={handleClose}
          role="link"
          tabIndex={0}
        >
          <img src={CrossImg} alt="" />
        </div>
      </div>
      {!user.address ? (
        <div className="recent-txs__err">
          <div className="recent-txs__err-text text-purple text-med">
            Please connect your wallet to view your recent transactions
          </div>
          <Button link="/trade/swap" className="recent-txs__err-btn">
            <span className="text-white text-smd">Close</span>
          </Button>
        </div>
      ) : (
        ''
      )}
      {user.address ? (
        <Scrollbar
          className="recent-txs__scroll"
          style={{
            width: '100%',
            height: txs.length > 3 ? '50vh' : `${txs.length * 175}px`,
          }}
        >
          {txs.map((tx) => (
            <div className="recent-txs__item">
              <div className="box-f-ai-c box-f-jc-sb">
                <span className="text-smd text-purple text-med">{tx.type}</span>
                <a href="/" target="_blank">
                  <img src={OpenLinkImg} alt="" />
                </a>
              </div>
              <div className="recent-txs__item-box box-f-ai-c box-f-jc-sb">
                <div className="text-med text-smd">{tx.from.value}</div>
                <div className="box-f-ai-c recent-txs__item-currency">
                  <div className="recent-txs__item-currency-name text-gray">{tx.from.symbol}</div>
                  <img
                    src={tx.from.img}
                    alt={tx.from.symbol}
                    className="recent-txs__item-currency-img"
                  />
                </div>
              </div>
              <div className="recent-txs__item-box box-f-ai-c box-f-jc-sb">
                <div className="text-med text-smd">{tx.to.value}</div>
                <div className="box-f-ai-c recent-txs__item-currency">
                  <div className="recent-txs__item-currency-name text-gray">{tx.to.symbol}</div>
                  <img
                    src={tx.to.img}
                    alt={tx.to.symbol}
                    className="recent-txs__item-currency-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </Scrollbar>
      ) : (
        ''
      )}
    </div>
  );
});

export default RecentTxs;
