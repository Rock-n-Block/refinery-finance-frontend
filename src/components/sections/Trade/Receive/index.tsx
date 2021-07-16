import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import BigNumber from 'bignumber.js/bignumber';

import { TradeBox } from '..';
import { Button } from '../../../atoms';
import { ILiquidityInfo } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import MetamaskService from '../../../../services/web3';
import { useMst } from '../../../../store';

import './Receive.scss';

import BnbImg from '@/assets/img/currency/unknown.svg';

interface IReceiveState extends ILiquidityInfo {
  lpTokens: string;
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
            new BigNumber(liquidityInfo?.token0.receive).multipliedBy(0.99).toFixed(0),
            new BigNumber(liquidityInfo?.token1.receive).multipliedBy(0.99).toFixed(0),
            user.address,
            moment.utc().add(20, 'm').valueOf(),
          ],
        });
        history.push('/trade/liquidity');
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
      {liquidityInfo && liquidityInfo.token0.receive && liquidityInfo.token1.receive ? (
        <div className="receive__box">
          <div className="receive__item box-f-ai-c box-f-jc-sb">
            <div className="text-lmd">
              {MetamaskService.amountFromGwei(
                liquidityInfo.token0.receive,
                +liquidityInfo.token0.decimals,
              )}
            </div>
            <div className="receive__item-currency box-f-ai-c">
              <div className="text-upper text-smd">{liquidityInfo?.token0.symbol}</div>
              <img src={BnbImg} alt="" />
            </div>
          </div>
          <div className="text-purple text-lmd text-med receive__plus">+</div>
          <div className="receive__item box-f-ai-c box-f-jc-sb">
            <div className="text-lmd">
              {MetamaskService.amountFromGwei(
                liquidityInfo.token1.receive,
                +liquidityInfo.token1.decimals,
              )}
            </div>
            <div className="receive__item-currency box-f-ai-c">
              <div className="text-upper text-smd">{liquidityInfo?.token1.symbol}</div>
              <img src={BnbImg} alt="" />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="text text-gray">
        Output is stimulated. If the price changes by more than 0.8% your transaction will revert.
      </div>
      {liquidityInfo?.lpTokens ? (
        <div className="receive__burned text-smd text-purple">
          <span>
            LP {liquidityInfo?.token0.symbol}/{liquidityInfo?.token1.symbol} Burned
          </span>
          <div className="box-f-ai-c">
            <img src={BnbImg} alt="" />
            <img src={BnbImg} alt="" />
            <span>{MetamaskService.amountFromGwei(liquidityInfo?.lpTokens, 18)}</span>
          </div>
        </div>
      ) : (
        ''
      )}
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
