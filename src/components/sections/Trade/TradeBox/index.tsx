import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import './TradeBox.scss';

import SettingsImg from '@/assets/img/icons/settings.svg';
import RecentTxImg from '@/assets/img/icons/recent-tx.svg';

interface ITradeBox {
  title: string;
  subtitle: string;
  settingsLink: string;
  recentTxLink: string;
  className?: string;
}

const TradeBox: React.FC<ITradeBox> = ({
  title,
  subtitle,
  settingsLink,
  recentTxLink,
  children,
  className,
}) => {
  return (
    <div className={cn('trade-box box-shadow box-white', className)}>
      <div className="trade-box__box-top box-f box-f-jc-sb">
        <div className="">
          <div className="trade-box__title text-md text-purple text-med">{title}</div>
          <div className="trade-box__subtitle text-gray">{subtitle}</div>
        </div>
        <div className="box-f-ai-c">
          <Link to={settingsLink} className="trade-box__icon">
            <img src={SettingsImg} alt="advanced settings" />
          </Link>
          <Link to={recentTxLink} className="trade-box__icon">
            <img src={RecentTxImg} alt="advanced settings" />
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
};

export default TradeBox;
