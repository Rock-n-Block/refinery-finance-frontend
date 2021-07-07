import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { Scrollbar } from 'react-scrollbars-custom';

import { useMst } from '../../../../store';
import { Button } from '../../../atoms';
import { IRecentTx } from '../../../../types';

import './RecentTxs.scss';

import CrossImg from '../../../../assets/img/icons/cross.svg';
import UnknownImg from '@/assets/img/currency/unknown.svg';
import OpenLinkImg from '@/assets/img/icons/open-link.svg';

interface IRecentTxs {
  items?: IRecentTx[];
}

const RecentTxs: React.FC<IRecentTxs> = observer(({ items }) => {
  const history = useHistory();
  const { user } = useMst();

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
          <Button onClick={handleClose} className="recent-txs__err-btn">
            <span className="text-white text-smd">Close</span>
          </Button>
        </div>
      ) : (
        ''
      )}
      {user.address && items?.length ? (
        <Scrollbar
          className="recent-txs__scroll"
          style={{
            width: '100%',
            height: items.length > 3 ? '50vh' : `${items.length * 185}px`,
          }}
        >
          {items.map((tx) => (
            <div className="recent-txs__item" key={tx.address}>
              <div className="box-f-ai-c box-f-jc-sb">
                <span className="text-smd text-purple text-med">{tx.type}</span>
                <a
                  href={`https://kovan.etherscan.io/tx/${tx.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={OpenLinkImg} alt="" />
                </a>
              </div>
              <div className="recent-txs__item-box box-f-ai-c box-f-jc-sb">
                <div className="text-med text-smd">{tx.from.value}</div>
                <div className="box-f-ai-c recent-txs__item-currency">
                  <div className="recent-txs__item-currency-name text-gray">{tx.from.symbol}</div>
                  <img
                    src={tx.from.img || UnknownImg}
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
                    src={tx.to.img || UnknownImg}
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
      {!items || !items?.length ? (
        <div className="recent-txs__err">
          <div className="recent-txs__err-text text-purple text-med">Transactions not found</div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
});

export default RecentTxs;
