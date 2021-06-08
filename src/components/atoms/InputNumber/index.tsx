import React from 'react';
import { InputNumber as Input } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import cn from 'classnames';

import 'antd/lib/input-number/style/css';
import './InputNumber.scss';

interface IInputNumberProps extends InputNumberProps {
  inputSize?: 'lg' | 'md' | 'sm';
  colorScheme?: 'gray' | 'outline';
  inputPrefix?: string | React.ReactElement;
  onChange?: (value: number | string) => void;
  onFocus?: () => void;
  className?: string;
  placeholder?: string;
}

const InputNumber: React.FC<IInputNumberProps> = React.memo(
  ({
    inputSize = 'lg',
    colorScheme = 'gray',
    inputPrefix,
    onChange,
    onFocus,
    className,
    placeholder,
  }) => {
    return (
      <div
        className={cn(
          'input-number__box box-f-ai-c',
          `input-number-${inputSize}-box`,
          `input-number-${colorScheme}-box`,
          className,
        )}
      >
        <Input
          type="number"
          className={cn('input-number', `input-number-${inputSize}`, `input-number-${colorScheme}`)}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          onWheel={(e: any) => {
            e.target.blur();
          }}
        />
        {inputPrefix ? <div className="input-number__prefix">{inputPrefix}</div> : ''}
      </div>
    );
  },
);

export default InputNumber;
