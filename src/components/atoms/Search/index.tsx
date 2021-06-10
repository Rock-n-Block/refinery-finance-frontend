import React from 'react';
import cn from 'classnames';
import { Input as AntdInput } from 'antd';

import { Input, InputNumber, Button } from '..';

import './Search.scss';

import LupaImg from '../../../assets/img/icons/lupa.svg';

interface ISearch {
  size?: 'sm' | 'lg' | 'md';
  realtime?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
  onChange?: (value: number | string) => void;
  btn?: boolean;
}

const Search: React.FC<ISearch> = React.memo(
  ({ type = 'text', placeholder, size = 'sm', realtime, onChange, btn }) => {
    const [inputValue, setInputValue] = React.useState<number | string>('');

    const inputRef = React.useRef<AntdInput>(null);
    const inputNumberRef = React.useRef<HTMLInputElement>(null);
    // const inputRef = React.useRef<AntdInputnumber>(null);

    const handleChange = (value: number | string) => {
      setInputValue(value);
      if (realtime && onChange) {
        onChange(value);
      }
    };

    const handleImgClick = () => {
      if (inputValue) {
        return onChange && onChange(inputValue);
      }
      if (type === 'text') {
        return inputRef.current && inputRef.current.focus();
      }
      if (type === 'number') {
        return inputNumberRef.current && inputNumberRef.current.focus();
      }
      return undefined;
    };

    const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && e.currentTarget.value) {
        return onChange && onChange(inputValue);
      }
      return undefined;
    };

    return (
      <div className={cn('search box-f-ai-c', `${size ? `input-${size}` : ''}`)}>
        <div
          className="search__img"
          onClick={handleImgClick}
          onKeyDown={handleImgClick}
          role="button"
          tabIndex={-1}
        >
          <img src={LupaImg} alt="search" />
        </div>
        {type === 'number' ? (
          <InputNumber
            onChange={handleChange}
            onKeyDown={handleEnterDown}
            colorScheme="transparent"
            ref={inputNumberRef}
            inputSize={size}
            inputClass={cn({
              'text-md': size === 'lg',
            })}
          />
        ) : (
          ''
        )}
        {type === 'text' ? (
          <Input
            value={inputValue}
            className={cn({
              'text-md': size === 'lg',
            })}
            ref={inputRef}
            placeholder={placeholder}
            onChange={(e: any) => handleChange(e.target.value)}
            onKeyDown={handleEnterDown}
          />
        ) : (
          ''
        )}
        {btn ? (
          <Button onClick={handleImgClick}>
            <span className="text-bold text-md text-white">Search</span>
          </Button>
        ) : (
          ''
        )}
      </div>
    );
  },
);

export default Search;
