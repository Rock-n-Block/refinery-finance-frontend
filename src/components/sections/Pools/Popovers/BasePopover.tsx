import React from 'react';

import InfoImg from '@/assets/img/icons/info.svg';
import { Popover } from '@/components/atoms';

export interface IBasePopover {
  className?: string;
  text: string;
}

const BasePopover: React.FC<IBasePopover> = ({ className, text, ...props }) => {
  return (
    <Popover
      className={className}
      content={<span className="text-med text text-purple">{text}</span>}
      overlayInnerStyle={{ borderRadius: '20px' }}
      {...props}
    >
      <img src={InfoImg} alt="" />
    </Popover>
  );
};

export default BasePopover;

export const withPopover = (text: string) => {
  return (props: Omit<IBasePopover, 'text'>): JSX.Element => {
    return <BasePopover text={text} {...props} />;
  };
};
