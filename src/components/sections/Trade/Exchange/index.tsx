import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { InputNumber, Button } from '../../../atoms';
import { SelectTokenModal } from '..';
import { IToken } from '../Swap';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';

import './Exchange.scss';

import SettingsImg from '@/assets/img/icons/settings.svg';
import RecentTxImg from '@/assets/img/icons/recent-tx.svg';
import ArrowImg from '@/assets/img/icons/arrow-cur.svg';

interface IExchange {
  tokenFrom: IToken;
  tokenFromQuantity: number;
  tokenToQuantity: number;
  tokenTo: IToken;
  handleChangeToken: (type: 'from' | 'to', token: IToken) => void;
  handleChangeTokensQuantity: (type: 'from' | 'to', quantity: number) => void;
}

const Exchange: React.FC<IExchange> = observer(
  ({
    tokenFrom,
    tokenFromQuantity,
    tokenTo,
    tokenToQuantity,
    handleChangeToken,
    handleChangeTokensQuantity,
  }) => {
    const connector = useWalletConnectorContext();
    const { user } = useMst();

    const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
    const [tokenType, setTokenType] = React.useState<'from' | 'to'>('from');

    const handleCloseSelectTokenModal = (): void => {
      setModalVisible(false);
    };

    const handleOpenSelectTokenModal = (type: 'from' | 'to'): void => {
      setModalVisible(true);
      setTokenType(type);
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
            <div className="text-upper text-purple text-med">{tokenFrom.symbol}</div>
            <div className="text-sm text-gray text-med">From</div>
          </div>
          <div className="box-f box-f-jc-sb">
            <div
              className="exchange__currency box-f-ai-c"
              onClick={() => handleOpenSelectTokenModal('from')}
              onKeyDown={() => handleOpenSelectTokenModal('from')}
              tabIndex={0}
              role="button"
            >
              <img src={tokenFrom.img} alt="" className="exchange__currency-img" />
              <img src={ArrowImg} alt="" className="exchange__currency-arrow" />
            </div>
            <InputNumber
              value={tokenFromQuantity}
              onChange={(value: number | string) => handleChangeTokensQuantity('from', +value)}
            />
          </div>
          <div
            className="exchange__line box-f-ai-c"
            onClick={() => handleChangeToken('from', tokenTo)}
            onKeyDown={() => handleChangeToken('from', tokenTo)}
            role="button"
            tabIndex={0}
          >
            <span className="box-circle" />
          </div>
          <div className="box-f-jc-sb box-f exchange__box-title">
            <div className="text-upper text-purple text-med">{tokenTo.symbol}</div>
            <div className="text-sm text-gray text-med">To</div>
          </div>
          <div className="box-f box-f-jc-sb">
            <div
              className="exchange__currency box-f-ai-c"
              onClick={() => handleOpenSelectTokenModal('to')}
              onKeyDown={() => handleOpenSelectTokenModal('to')}
              tabIndex={0}
              role="button"
            >
              <img src={tokenTo.img} alt="" className="exchange__currency-img" />
              <img src={ArrowImg} alt="" className="exchange__currency-arrow" />
            </div>
            <InputNumber
              value={tokenToQuantity}
              onChange={(value: number | string) => handleChangeTokensQuantity('to', +value)}
            />
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
        <SelectTokenModal
          isVisible={isModalVisible}
          handleClose={handleCloseSelectTokenModal}
          handleChangeToken={handleChangeToken}
          tokenType={tokenType}
        />
      </>
    );
  },
);

export default Exchange;
