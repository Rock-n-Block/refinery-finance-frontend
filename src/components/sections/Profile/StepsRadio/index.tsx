/* eslint-disable react/react-in-jsx-scope */
import { FC, memo } from 'react';
import { RadioChangeEvent } from 'antd';
import cn from 'classnames';

import { RadioGroup } from '@/components/atoms';

import CheckImg from '../../../../assets/img/sections/profile/checkImg.svg';

import './StepsRadio.scss';

interface IStepsRadio {
  activeStep: number;
  onChange: (event: RadioChangeEvent) => void;
}

const StepsRadio: FC<IStepsRadio> = memo(({ activeStep, onChange }) => {
  const itemsData = [
    { text: 'Get Starter Collectible', value: 1 },
    { text: 'Set Profile Picture', value: 2 },
    { text: 'Join Team', value: 3 },
    { text: 'Set Name', value: 4 },
  ];

  const radioItemsArr = itemsData.map((item) => {
    return {
      text: (
        <div
          key={item.value}
          className={cn('stepsRadio__item box-f-fd-c', {
            'stepsRadio__item-last': item.value === 4,
          })}
        >
          <div
            className={cn(
              'stepsRadio__item-num',
              {
                'stepsRadio__item-num-active': item.value === activeStep,
              },
              {
                'stepsRadio__item-num-checked': activeStep < item.value,
              },
            )}
          >
            {activeStep <= item.value ? `${item.value}.` : <img src={CheckImg} alt="checkImg" />}
          </div>
          <div className="stepsRadio__item-text">{item.text}</div>
        </div>
      ),
      value: item.value,
    };
  });

  return (
    <RadioGroup
      items={radioItemsArr}
      value={activeStep}
      onChange={onChange}
      className="stepsRadio"
    />
  );
});

export default StepsRadio;
