import React from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd } from 'antd';
import classNames from 'classnames';

import 'antd/lib/button/style/css';
import './Button.scss';

import { ReactComponent as ArrowImg } from '../../../assets/img/icons/arrow-btn.svg';

export interface IColorScheme {
  colorScheme?: 'yellow' | 'outline' | 'white' | 'outline-purple' | 'purple';
}

export interface ISize {
  size?: 'ssm' | 'sm' | 'lsm' | 'smd' | 'md' | 'lmd' | 'lg';
}

export interface ButtonProps extends IColorScheme, ISize {
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  link?: string;
  linkClassName?: string;
  shadow?: boolean;
  icon?: string;
  arrow?: boolean;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  isActive?: boolean | null;
}

const Button: React.FC<ButtonProps> = React.memo(
  ({
    children,
    className,
    size = 'md',
    colorScheme = 'yellow',
    onClick,
    disabled = false,
    loading = false,
    link,
    linkClassName,
    icon,
    arrow,
    toggle,
    isActive = null,
    onToggle,
  }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (toggle && onToggle) {
        onToggle(!isActive);
      }
      return onClick && onClick();
    };

    const BtnContent = (
      <>
        {icon ? <img src={icon} alt="icon" className="btn-icon" /> : <></>}
        {children}
        {arrow ? <ArrowImg className="btn__arrow" /> : ''}
      </>
    );

    const Btn = (
      <BtnAntd
        onClick={handleClick}
        disabled={disabled || loading}
        className={classNames(
          className || '',
          'text btn box-f-c',
          `btn-${size}`,
          `btn-${colorScheme}`,
          {
            'btn-loading': loading,
            'active': isActive,
          },
        )}
      >
        {loading ? 'In progress...' : BtnContent}
      </BtnAntd>
    );
    if (link) {
      return (
        <Link className={classNames('btn-link', linkClassName)} to={link}>
          {Btn}
        </Link>
      );
    }
    return Btn;
  },
);

export default Button;
