import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { InputNumber, Button } from '../../../atoms';
import { SelectTokenModal } from '../../../organisms';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';

import './Exchange.scss';

import SettingsImg from '@/assets/img/icons/settings.svg';
import RecentTxImg from '@/assets/img/icons/recent-tx.svg';
import ArrowImg from '@/assets/img/icons/arrow-cur.svg';
import BnbImg from '@/assets/img/currency/bnb.svg';

const Exchange: React.FC = observer(() => {
  const connector = useWalletConnectorContext();
  const { user } = useMst();

  const [isModalVisible, setModalVisible] = React.useState<boolean>(true);

  const handleCloseSelectTokenModal = (): void => {
    setModalVisible(false);
  };

  const handleOpenSelectTokenModal = (): void => {
    setModalVisible(true);
  };

  return (
    <>
      <div className="exchange box-shadow box-white">
        <div className="exchange__box-top box-f box-f-jc-sb">
          <div className="">
            <div className="exchange__title text-md text-purple text-med">Exchange</div>
            <div className="exchange__subtitle text-gray">Trade tokens in an instant</div>
          </div>
          <div className="box-f-ai-c">
            <Link to="/trade/swap/settings" className="exchange__icon">
              <img src={SettingsImg} alt="advanced settings" />
            </Link>
            <Link to="/trade/swap/history" className="exchange__icon">
              <img src={RecentTxImg} alt="advanced settings" />
            </Link>
          </div>
        </div>
        <div className="box-f-jc-sb box-f exchange__box-title">
          <div className="text-upper text-purple text-med">BNB</div>
          <div className="text-sm text-gray text-med">From</div>
        </div>
        <div className="box-f box-f-jc-sb">
          <div
            className="exchange__currency box-f-ai-c"
            onClick={handleOpenSelectTokenModal}
            onKeyDown={handleOpenSelectTokenModal}
            tabIndex={0}
            role="button"
          >
            <img src={BnbImg} alt="" className="exchange__currency-img" />
            <img src={ArrowImg} alt="" className="exchange__currency-arrow" />
          </div>
          <InputNumber />
        </div>
        <div className="exchange__line box-f-ai-c">
          <span className="box-circle" />
        </div>
        <div className="box-f-jc-sb box-f exchange__box-title">
          <div className="text-upper text-purple text-med">BNB</div>
          <div className="text-sm text-gray text-med">To</div>
        </div>
        <div className="box-f box-f-jc-sb">
          <div
            className="exchange__currency box-f-ai-c"
            onClick={handleOpenSelectTokenModal}
            onKeyDown={handleOpenSelectTokenModal}
            tabIndex={0}
            role="button"
          >
            <img src={BnbImg} alt="" className="exchange__currency-img" />
            <img src={ArrowImg} alt="" className="exchange__currency-arrow" />
          </div>
          <InputNumber />
        </div>
        {user.address ? (
          <Button className="exchange__btn">
            <span className="text-bold text-md text-white">Swap</span>
          </Button>
        ) : (
          <Button className="exchange__btn" onClick={connector.connect}>
            <span className="text-bold text-md text-white">Connect</span>
          </Button>
        )}
      </div>
      <SelectTokenModal isVisible={isModalVisible} handleClose={handleCloseSelectTokenModal} />
    </>
  );
});

export default Exchange;
