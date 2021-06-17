import React from 'react';
import { Radio, RadioGroupProps } from 'antd';
import cn from 'classnames';

import 'antd/lib/radio/style/css';
import './RadioGroup.scss';

interface IRadioGroupItem {
  text: string;
  value: string | number;
}

interface IRadioGroup extends RadioGroupProps {
  items: IRadioGroupItem[];
  className?: string;
}

const { Group, Button } = Radio;

const RadioGroup: React.FC<IRadioGroup> = React.memo(({ items, className, ...other }) => {
  return (
    <Group {...other} className={cn('r-group', className)}>
      {items.map((item) => (
        <Button key={item.value} value={item.value} className="r-group__btn">
          <span className="text text-med">{item.text}</span>
        </Button>
      ))}
    </Group>
  );
});

export default RadioGroup;
