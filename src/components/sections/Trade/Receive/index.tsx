import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { TradeBox } from '..';
import { Button } from '../../../atoms';
import { ILiquidityInfo } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import MetamaskService from '../../../../services/web3';
import { useMst } from '../../../../store';

import './Receive.scss';

import BnbImg from '@/assets/img/currency/unknown.svg';

interface IReceiveState extends ILiquidityInfo {
  lpTokens: string | number;
}

const Receive: React.FC = observer(() => {
  const { metamaskService } = useWalletConnectorContext();
  const location = useLocation<IReceiveState>();
  const history = useHistory();
  const { user } = useMst();

  const [liquidityInfo, setLiquidityInfo] = React.useState<IReceiveState>();

  const handleRemoveLiquidity = async () => {
    try {
      if (liquidityInfo && liquidityInfo?.token0.receive && liquidityInfo?.token1.receive) {
        await metamaskService.createTransaction({
          method: 'removeLiquidity',
          contractName: 'ROUTER',
          data: [
            liquidityInfo?.token0.address,
            liquidityInfo?.token1.address,
            liquidityInfo.lpTokens,
            MetamaskService.calcTransactionAmount(
              liquidityInfo?.token0.receive,
              +liquidityInfo?.token0.decimals,
            ),
            MetamaskService.calcTransactionAmount(
              liquidityInfo?.token1.receive,
              +liquidityInfo?.token1.decimals,
            ),
            user.address,
            moment.utc().add(20, 'm').valueOf(),
          ],
        });
      }
    } catch (err) {
      console.log('remove liquidity', err);
    }
  };

  React.useEffect(() => {
    if (location.state) {
      setLiquidityInfo(location.state);
    } else {
      history.push('/trade/liquidity');
    }
  }, [location, history]);

  return (
    <TradeBox className="receive" title="You will receive" titleBackLink>
      <div className="receive__box">
        <div className="receive__item box-f-ai-c box-f-jc-sb">
          <div className="text-lmd">{liquidityInfo?.token0.receive}</div>
          <div className="receive__item-currency box-f-ai-c">
            <div className="text-upper text-smd">{liquidityInfo?.token0.symbol}</div>
            <img src={BnbImg} alt="" />
          </div>
        </div>
        <div className="text-purple text-lmd text-med receive__plus">+</div>
        <div className="receive__item box-f-ai-c box-f-jc-sb">
          <div className="text-lmd">{liquidityInfo?.token1.receive}</div>
          <div className="receive__item-currency box-f-ai-c">
            <div className="text-upper text-smd">{liquidityInfo?.token0.symbol}</div>
            <img src={BnbImg} alt="" />
          </div>
        </div>
      </div>
      <div className="text text-gray">
        Output is stimulated. If the price changes by more than 0.8% your transaction will revert.
      </div>
      <div className="receive__burned box-f-ai-c box-f-jc-sb text-smd text-purple">
        <span>LP CAKE/BNB Burned</span>
        <div className="box-f-ai-c">
          <img src={BnbImg} alt="" />
          <img src={BnbImg} alt="" />
          <span>0.343535</span>
        </div>
      </div>
      {liquidityInfo?.token1.rate && liquidityInfo?.token0.rate ? (
        <div className="receive__price box-f box-f-jc-sb text-smd text-purple">
          <span>Price</span>
          <div>
            <div className="peceive__price-item">
              1 {liquidityInfo?.token0.symbol} = {+(+liquidityInfo?.token1.rate).toFixed(8)}{' '}
              {liquidityInfo?.token1.symbol}
            </div>
            <div className="peceive__price-item">
              1 {liquidityInfo?.token1.symbol} = {+(+liquidityInfo?.token0.rate).toFixed(8)}{' '}
              {liquidityInfo?.token0.symbol}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <Button className="receive__btn" onClick={handleRemoveLiquidity}>
        <span className="text-white text-bold text-md">Confirm</span>
      </Button>
    </TradeBox>
  );
});

export default Receive;
