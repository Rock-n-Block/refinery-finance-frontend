import React from 'react';
import { InputNumber as Input } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import cn from 'classnames';

import 'antd/lib/input-number/style/css';
import './InputNumber.scss';

interface IInputNumberProps extends InputNumberProps {
  inputSize?: 'lg' | 'md' | 'sm';
  colorScheme?: 'gray' | 'outline' | 'transparent';
  inputPrefix?: string | React.ReactElement;
  inputClass?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
}

const InputNumber: React.ForwardRefExoticComponent<IInputNumberProps> = React.memo(
  React.forwardRef<HTMLInputElement, IInputNumberProps>(
    (
      {
        inputSize = 'lg',
        colorScheme = 'gray',
        inputPrefix,
        onChange,
        onFocus,
        onKeyDown,
        className,
        placeholder,
        inputClass,
        value,
      },
      ref,
    ) => {
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
            ref={ref}
            className={cn(
              'input-number',
              `input-number-${inputSize}`,
              `input-number-${colorScheme}`,
              inputClass,
            )}
            onChange={onChange}
            value={value}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            onWheel={(e: any) => {
              e.target.blur();
            }}
          />
          {inputPrefix ? <div className="input-number__prefix">{inputPrefix}</div> : ''}
        </div>
      );
    },
  ),
);

export default InputNumber;
