/* eslint-disable react/react-in-jsx-scope */
import { FC } from 'react';
import { RadioChangeEvent } from 'antd';
import cn from 'classnames';

import { RadioGroup } from '@/components/atoms';

import RadioAvatar from '../../../../../../assets/img/sections/profile/radio-avatar.svg';

import './StepCardRadio.scss';

interface IStepCardRadio {
  formDataValue: string | undefined;
  items: string[];
  keyName: string;
  postfixImg?: string;
  postfixValue?: number;
  className?: string;
  onCnange: (event: RadioChangeEvent) => void;
}

const StepCardRadio: FC<IStepCardRadio> = ({
  items,
  keyName,
  formDataValue,
  onCnange,
  postfixImg,
  postfixValue,
  className,
}) => {
  return (
    <RadioGroup
      items={items.map((itemName) => {
        return {
          text: (
            <div className={cn('stepRadio-row', className)}>
              <div className="box-f-c">
                <div className="stepRadio-row__circle box-f-c">
                  <div
                    className={cn({
                      'stepRadio-row__circle-checked': formDataValue === itemName,
                    })}
                  />
                </div>
                <div className={postfixValue ? 'box-f-fd-c' : 'box-f-c'}>
                  {itemName}
                  {postfixValue && (
                    <div className="stepRadio-row-postfix box-f-c">
                      <img src={postfixImg} alt="teamImg" />
                      <span>{postfixValue}</span>
                    </div>
                  )}
                </div>
              </div>
              <img src={RadioAvatar} alt="radioAvatar" />
            </div>
          ),
          value: itemName,
        };
      })}
      value={formDataValue}
      onChange={onCnange}
      className="stepRadio"
      name={keyName}
    />
  );
};

export default StepCardRadio;
