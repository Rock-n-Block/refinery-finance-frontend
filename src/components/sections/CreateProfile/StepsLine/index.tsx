/* eslint-disable react/react-in-jsx-scope */
import { FC, memo } from 'react';
// import { RadioChangeEvent } from 'antd';
import cn from 'classnames';

import { RadioGroup } from '@/components/atoms';

import CheckImg from '../../../../assets/img/sections/createProfile/checkImg.svg';

import './StepsLine.scss';

interface IStepsLine {
  activeStep: number;
  // onChange: (event: RadioChangeEvent) => void;
}

const StepsLine: FC<IStepsLine> = memo(({ activeStep }) => {
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
          className={cn('stepsLine__item box-f-fd-c', {
            'stepsLine__item-last': item.value === 4,
          })}
        >
          <div
            className={cn(
              'stepsLine__item-num',
              {
                'stepsLine__item-num-active': item.value === activeStep,
              },
              {
                'stepsLine__item-num-checked': activeStep < item.value,
              },
            )}
          >
            {activeStep <= item.value ? `${item.value}.` : <img src={CheckImg} alt="checkImg" />}
          </div>
          <div className="stepsLine__item-text">{item.text}</div>
        </div>
      ),
      value: item.value,
    };
  });

  return (
    <RadioGroup
      items={radioItemsArr}
      value={activeStep}
      // onChange={onChange}
      className="stepsLine"
    />
  );
});

export default StepsLine;
