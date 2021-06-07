import React from 'react';
import { InputNumber as Input } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import cn from 'classnames';

import 'antd/lib/input-number/style/css';
import './InputNumber.scss';

interface IInputNumberProps extends InputNumberProps {
  inputSize?: 'lg' | 'md';
  colorScheme?: 'gray';
}

const InputNumber: React.FC<IInputNumberProps> = React.memo(
  ({ inputSize = 'lg', colorScheme = 'gray' }) => {
    console.log('render');
    return (
      <Input
        type="number"
        className={cn('input-number', `input-number-${inputSize}`, `input-number-${colorScheme}`)}
      />
    );
  },
);

export default InputNumber;
