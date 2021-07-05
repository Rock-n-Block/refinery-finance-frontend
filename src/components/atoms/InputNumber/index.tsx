import React from 'react';
import { InputNumber as Input } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import cn from 'classnames';

import 'antd/lib/input-number/style/css';
import './InputNumber.scss';

interface IInputNumberProps extends InputNumberProps {
  inputSize?: 'lg' | 'md' | 'sm';
  colorScheme?: 'gray' | 'outline' | 'transparent' | 'white';
  inputPrefix?: string | React.ReactElement;
  inputClass?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
}

const InputNumber: React.ForwardRefExoticComponent<IInputNumberProps> = React.memo(
  React.forwardRef<HTMLInputElement, IInputNumberProps>((props, ref) => {
    const {
      inputSize = 'lg',
      colorScheme = 'gray',
      inputPrefix,
      className,
      inputClass,
      value,
      ...otherProps
    } = props;
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
          value={value}
          onWheel={(e: any) => {
            e.target.blur();
          }}
          {...otherProps}
        />
        {inputPrefix ? <div className="input-number__prefix">{inputPrefix}</div> : ''}
      </div>
    );
  }),
);

export default InputNumber;
