import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import nextId from 'react-id-generator';

import { Button, InputNumber, Switch } from '../../../atoms';

import CrossImg from '../../../../assets/img/icons/cross.svg';

import './ExchangeSettings.scss';

export interface IActiveSlippage {
  type: 'btn' | 'input';
  value: number;
}

interface IExchangeSettings {
  activeSlippage: IActiveSlippage;
  handleChangeActiveSlippage: (data: IActiveSlippage) => void;
  handleChangeTxDeadline: (value: number | string) => void;
}

const ExchangeSettings: React.FC<IExchangeSettings> = React.memo(
  ({ activeSlippage, handleChangeActiveSlippage, handleChangeTxDeadline }) => {
    const [slippageInputValue, setSlippageInputValue] = React.useState<number>(NaN);
    const btns = [0.1, 0.5, 1];

    const handleFocusSlippageInput = () => {
      if (+slippageInputValue) {
        handleChangeActiveSlippage({
          type: 'input',
          value: slippageInputValue,
        });
      }
    };

    const handleChangeSlippageInput = (value: number | string) => {
      setSlippageInputValue(+value);
      if (+value) {
        handleChangeActiveSlippage({
          type: 'input',
          value: +value,
        });
      } else {
        handleChangeActiveSlippage({ type: 'btn', value: 0.1 });
      }
    };

    return (
      <div className="exchange exch-settings box-shadow box-white">
        <div className="box-f-jc-sb box-f-ai-c exch-settings__box-title">
          <div className="text-med text-purple text-md">Advanced Settings</div>
          <Link to="/trade/swap" className="exch-settings__close">
            <img src={CrossImg} alt="" />
          </Link>
        </div>
        <div className="exch-settings__section">
          <div className="exch-settings__section-title text-med text-purple">
            Slippage tolerance
          </div>
          <div className="box-f box-f-jc-sb">
            {btns.map((btn) => (
              <Button
                key={nextId()}
                size="sm"
                colorScheme="outline"
                onClick={() => handleChangeActiveSlippage({ type: 'btn', value: btn })}
                className={cn('exch-settings__slippage-btn', {
                  active: activeSlippage.type === 'btn' && activeSlippage.value === btn,
                })}
              >
                {btn}%
              </Button>
            ))}
            <InputNumber
              value={slippageInputValue}
              colorScheme="outline"
              inputSize="sm"
              inputPrefix="%"
              onFocus={handleFocusSlippageInput}
              onChange={handleChangeSlippageInput}
              className={cn('exch-settings__slippage-input', {
                active: activeSlippage.type === 'input' && activeSlippage.value,
              })}
            />
          </div>
        </div>
        <div className="exch-settings__section">
          <div className="exch-settings__section-title text-med text-purple">
            Transaction deadline
          </div>
          <div className="box-f-ai-c">
            <InputNumber
              colorScheme="outline"
              inputSize="sm"
              onChange={handleChangeTxDeadline}
              className="exch-settings__txdeadline-input"
              placeholder="0"
            />
            <span className="text-med text-gray">Minutes</span>
          </div>
        </div>
        <div className="exch-settings__section">
          <div className="exch-settings__section-title text-med text-purple">Audio</div>
          <Switch colorScheme="purple" switchSize="bg" />
        </div>
        <Button className="exch-settings__btn">
          <span className="text-smd text-white">Save and close</span>
        </Button>
      </div>
    );
  },
);

export default ExchangeSettings;
