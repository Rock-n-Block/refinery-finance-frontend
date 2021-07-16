import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { TradeBox } from '..';
import { Slider, Button } from '../../../atoms';
import { ILiquidityInfo } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import Web3Config from '../../../../services/web3/config';
import MetamaskService from '../../../../services/web3';
import { useMst } from '../../../../store';

import './RemoveLiquidity.scss';

import UnkNownImg from '@/assets/img/currency/unknown.svg';

const RemoveLiquidity: React.FC = observer(() => {
  const { user } = useMst();
  const { metamaskService } = useWalletConnectorContext();

  const location = useLocation<ILiquidityInfo>();
  const history = useHistory();
  const [percent, setPercent] = React.useState<number>(25);

  const [liquidityInfo, setLiquidityInfo] = React.useState<ILiquidityInfo>();
  const [isTokensApprove, setTokensApprove] = React.useState<boolean>(false);
  const [lpBalance, setLpBalance] = React.useState<string>('');

  const btns = [25, 50, 75];

  const handlePercentChange = (value: number) => {
    setPercent(value);
  };

  const handleCheckApprove = React.useCallback(async () => {
    try {
      if (liquidityInfo && user.address) {
        const balance = await metamaskService.callContractMethodFromNewContract(
          liquidityInfo?.address,
          Web3Config.PAIR.ABI,
          'balanceOf',
          [user.address],
        );

        setLpBalance(balance);

        const result = await metamaskService.checkTokenAllowance({
          contractName: 'PAIR',
          approvedAddress: Web3Config.ROUTER.ADDRESS,
          tokenAddress: liquidityInfo?.address,
          approveSum: +MetamaskService.amountFromGwei(balance, 18),
        });

        setTokensApprove(result);
      }
    } catch (err) {
      console.log('check lp approve');
      setTokensApprove(false);
    }
  }, [liquidityInfo, metamaskService, user.address]);

  const handleApprove = async () => {
    try {
      if (liquidityInfo && user.address) {
        await metamaskService.approveToken({
          contractName: 'PAIR',
          approvedAddress: Web3Config.ROUTER.ADDRESS,
          tokenAddress: liquidityInfo?.address,
        });

        setTokensApprove(true);
      }
    } catch (err) {
      console.log('approve lp', err);
      setTokensApprove(false);
    }
  };

  React.useEffect(() => {
    if (location.state) {
      setLiquidityInfo(location.state);
    } else {
      history.push('/trade/liquidity');
    }
  }, [location, history]);

  React.useEffect(() => {
    handleCheckApprove();
  }, [handleCheckApprove]);

  return (
    <TradeBox className="r-liquidity" title="Remove Liguidity" titleBackLink>
      <div className="r-liquidity__percent text-purple">{percent}%</div>
      <Slider
        tooltipVisible={false}
        onChange={handlePercentChange}
        defaultValue={25}
        value={percent}
        min={25}
      />
      <div className="r-liquidity__percent-btns box-f-ai-c box-f-jc-sb">
        {btns.map((btn) => (
          <Button
            colorScheme="purple-l"
            size="smd"
            key={btn}
            onClick={() => handlePercentChange(btn)}
          >
            <span className="text-ssmd text-med">{btn}%</span>
          </Button>
        ))}
        <Button colorScheme="purple-l" size="smd" onClick={() => handlePercentChange(100)}>
          <span className="text-ssmd text-med">Max</span>
        </Button>
      </div>
      {liquidityInfo && liquidityInfo.token0.deposited && liquidityInfo.token1.deposited ? (
        <div className="r-liquidity__content">
          <div className="r-liquidity__currency box-f-ai-c box-f-jc-sb">
            <div className="r-liquidity__currency-sum text-lmd">
              {
                +new BigNumber(
                  MetamaskService.amountFromGwei(
                    liquidityInfo.token0.deposited,
                    +liquidityInfo.token0.decimals,
                  ),
                ).multipliedBy(percent / 100)
              }
            </div>
            <div className="box-f-ai-c r-liquidity__currency-item">
              <div className="text-smd text-upper">{liquidityInfo?.token0.symbol}</div>
              <img src={UnkNownImg} alt="" />
            </div>
          </div>
          <div className="r-liquidity__currency box-f-ai-c box-f-jc-sb">
            <div className="r-liquidity__currency-sum text-lmd">
              {
                +new BigNumber(
                  MetamaskService.amountFromGwei(
                    liquidityInfo.token1.deposited,
                    +liquidityInfo.token1.decimals,
                  ),
                )
                  .multipliedBy(percent / 100)
                  .toFixed(8)
              }
            </div>
            <div className="box-f-ai-c r-liquidity__currency-item">
              <div className="text-smd text-upper">{liquidityInfo?.token1.symbol}</div>
              <img src={UnkNownImg} alt="" />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {liquidityInfo?.token1.rate && liquidityInfo?.token0.rate ? (
        <div className="r-liquidity__price box-f box-f-jc-sb text-purple">
          <span>Price</span>
          <div>
            <div className="r-liquidity__price-item text-right">
              1 {liquidityInfo?.token0.symbol} = {+(+liquidityInfo?.token1.rate).toFixed(8)}{' '}
              {liquidityInfo?.token1.symbol}
            </div>
            <div className="r-liquidity__price-item text-right">
              1 {liquidityInfo?.token1.symbol} = {+(+liquidityInfo?.token0.rate).toFixed(8)}{' '}
              {liquidityInfo?.token0.symbol}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="r-liquidity__btns box-f-ai-c box-f-jc-sb">
        {!isTokensApprove ? (
          <Button onClick={handleApprove}>
            <span className="text-white text-bold text-md">Approve</span>
          </Button>
        ) : (
          <div className="" />
        )}
        {liquidityInfo && liquidityInfo.token0.deposited && liquidityInfo.token1.deposited ? (
          <Button
            disabled={!isTokensApprove}
            link={{
              pathname: '/trade/liquidity/receive',
              state: {
                address: liquidityInfo?.address,
                lpTokens: new BigNumber(lpBalance)
                  .multipliedBy(new BigNumber(percent).dividedBy(100))
                  .toString(10),
                token0: {
                  ...liquidityInfo?.token0,
                  receive: new BigNumber(liquidityInfo.token0.deposited)
                    .multipliedBy(new BigNumber(percent).dividedBy(100))
                    .toString(10),
                },
                token1: {
                  ...liquidityInfo?.token1,
                  receive: +new BigNumber(liquidityInfo.token1.deposited)
                    .multipliedBy(new BigNumber(percent).dividedBy(100))
                    .toString(10),
                },
              },
            }}
          >
            <span className="text-white text-bold text-md">Remove</span>
          </Button>
        ) : (
          ''
        )}
      </div>
    </TradeBox>
  );
});

export default RemoveLiquidity;
