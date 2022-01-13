import React, { ReactElement } from 'react';
import { Radio, RadioGroupProps } from 'antd';
import cn from 'classnames';

import 'antd/lib/radio/style/css';

import './RadioGroup.scss';

interface IRadioGroupItem {
  text: string | ReactElement;
  value: string | number;
}

interface IRadioGroup extends RadioGroupProps {
  items: IRadioGroupItem[];
  className?: string;
  buttonClassName?: string;
  name?: string;
}

const { Group, Button } = Radio;

const RadioGroup: React.FC<IRadioGroup> = React.memo(
  ({ items, className, buttonClassName, name, ...other }) => {
    return (
      <Group {...other} className={cn('r-group', className)} name={name}>
        {items.map((item) => (
          <Button
            key={item.value}
            value={item.value}
            className={cn('r-group__btn', buttonClassName)}
          >
            <span className="text text-med">{item.text}</span>
          </Button>
        ))}
      </Group>
    );
  },
);

export default RadioGroup;
