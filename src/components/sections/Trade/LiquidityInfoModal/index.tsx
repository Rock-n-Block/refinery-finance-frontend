import React from 'react';
import { observer } from 'mobx-react-lite';

import { Modal } from '../../../molecules';
import { Button } from '../../../atoms';
import { ILiquidityInfo } from '../../../../types';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';
import Web3Config from '../../../../services/web3/config';

import './LiquidityInfoModal.scss';

import UnknownImg from '@/assets/img/currency/unknown.svg';

interface ILiquidityInfoModal {
  handleCloseModal: () => void;
  info?: ILiquidityInfo;
}

const LiquidityInfoModal: React.FC<ILiquidityInfoModal> = observer(({ info, handleCloseModal }) => {
  const { metamaskService } = useWalletConnectorContext();
  const { user } = useMst();

  const [deposit0, setDeposit0] = React.useState<number | string>(0);
  const [deposit1, setDeposit1] = React.useState<number | string>(0);

  const getDeposites = React.useCallback(async () => {
    try {
      if (info?.address && user.address) {
        const lpBalance = await metamaskService.callContractMethodFromNewContract(
          info?.address,
          Web3Config.PAIR.ABI,
          'balanceOf',
          [user.address],
        );

        const supply = await metamaskService.callContractMethodFromNewContract(
          info?.address,
          Web3Config.PAIR.ABI,
          'totalSupply',
        );

        if (+lpBalance === +supply) {
          setDeposit0(info.token0.balance);
          setDeposit1(info.token1.balance);
        } else {
          const percent = lpBalance / supply;

          setDeposit0(+info.token0.balance * percent);
          setDeposit1(+info.token1.balance * percent);
        }
      }
    } catch (err) {
      console.log('get deposites', err);
    }
  }, [info?.address, metamaskService, user.address, info?.token0.balance, info?.token1.balance]);

  React.useEffect(() => {
    getDeposites();
  }, [getDeposites]);

  return (
    <Modal
      isVisible={!!info}
      className="liquidity-info"
      handleCancel={handleCloseModal}
      width={390}
      destroyOnClose
      closeIcon
    >
      {info ? (
        <div className="liquidity-info__content">
          <div className="liquidity-info__title box-f-ai-c">
            <img src={UnknownImg} alt={info.token0.symbol} />
            <img src={UnknownImg} alt={info.token1.symbol} />
            <span className="text-purple text-smd">{`${info.token0.symbol}/${info.token1.symbol}`}</span>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-purple text-smd">
            <span>{`${info.token0.symbol} Deposited`}</span>
            <div className="box-f-ai-c">
              <img src={UnknownImg} alt={info.token0.symbol} />
              <span>{deposit0}</span>
            </div>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-purple text-smd">
            <span>{`${info.token1.symbol} Deposited`}</span>
            <div className="box-f-ai-c">
              <img src={UnknownImg} alt={info.token1.symbol} />
              <span>{deposit1}</span>
            </div>
          </div>
          <div className="liquidity-info__row box-f box-f-jc-sb text-purple text-smd">
            <span>Rates</span>
            <div className="text-right">
              <div>{`1 ${info.token0.symbol} = ${+(+info.token1.rate).toFixed(8)} ${
                info.token1.symbol
              }`}</div>
              <br />
              <div>{`1 ${info.token1.symbol} = ${+(+info.token0.rate).toFixed(8)} ${
                info.token0.symbol
              }`}</div>
            </div>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-purple text-smd">
            <span>Share of Pool</span>
            <span>0.34353%</span>
          </div>
          <Button
            colorScheme="purple"
            size="smd"
            className="liquidity-info__btn"
            link={{
              pathname: '/trade/liquidity/remove',
              state: {
                address: info.address,
                token0: {
                  ...info.token0,
                  deposited: deposit0,
                },
                token1: {
                  ...info.token1,
                  deposited: deposit1,
                },
              },
            }}
          >
            <span>remove</span>
          </Button>
        </div>
      ) : (
        ''
      )}
    </Modal>
  );
});

export default LiquidityInfoModal;
