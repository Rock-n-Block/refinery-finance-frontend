import React from 'react';
import cn from 'classnames';
import { Input as AntdInput } from 'antd';

import { Input, InputNumber } from '..';

import './Search.scss';

import LupaImg from '../../../assets/img/icons/lupa.svg';

interface ISearch {
  size?: 'sm' | 'lg';
  realtime?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
  onChange?: (value: number | string) => void;
}

const Search: React.FC<ISearch> = ({
  type = 'text',
  placeholder,
  size = 'sm',
  realtime,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState<number | string>('');

  const inputRef = React.useRef<AntdInput>(null);

  const handleChange = (value: number | string) => {
    setInputValue(value);
    if (realtime && onChange) {
      onChange(value);
    }
  };

  const handleImgClick = () => {
    console.log(inputRef);
    if (inputValue) {
      return onChange && onChange(inputValue);
    }
    return inputRef.current && inputRef.current.focus();
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
      {type === 'number' ? <InputNumber onChange={handleChange} /> : ''}
      {type === 'text' ? (
        <Input
          value={inputValue}
          className=""
          ref={inputRef}
          placeholder={placeholder}
          onChange={(e: any) => handleChange(e.target.value)}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Search;
