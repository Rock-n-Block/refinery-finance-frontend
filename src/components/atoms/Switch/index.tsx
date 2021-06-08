import React from 'react';
import { Switch as AntdSwitch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';
import cn from 'classnames';

import 'antd/lib/switch/style/css';
import './Switch.scss';

interface ISwitch extends SwitchProps {
  colorScheme?: 'white' | 'purple';
  switchSize?: 'bg' | 'sm';
}

const Switch: React.FC<ISwitch> = (props) => {
  return (
    <AntdSwitch
      {...props}
      className={cn(
        'switch',
        `${props.colorScheme ? `switch-${props.colorScheme}` : ''}`,
        `${props.switchSize ? `switch-${props.switchSize}` : ''}`,
      )}
    />
  );
};

export default Switch;
