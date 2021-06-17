import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps } from 'antd/lib/input';
import cn from 'classnames';

import 'antd/lib/input/style/css';
import './Input.scss';

interface IInput extends InputProps {
  colorScheme?: 'transparent';
  inputSize?: 'sm' | 'md';
  ref?: React.ForwardedRef<AntdInput>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.ForwardRefExoticComponent<IInput> = React.forwardRef<AntdInput, IInput>(
  (
    {
      colorScheme = 'transparent',
      inputSize = 'sm',
      value,
      className,
      placeholder,
      onChange,
      onKeyDown,
    },
    ref,
  ) => {
    return (
      <AntdInput
        className={cn(
          'input',
          `${colorScheme ? `input-${colorScheme}` : ''}`,
          `${inputSize ? `input-${inputSize}` : ''}`,
          className,
        )}
        ref={ref}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        value={value}
      />
    );
  },
);

export default Input;
