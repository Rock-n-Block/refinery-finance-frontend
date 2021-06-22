import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';

import './TradeBox.scss';

import SettingsImg from '@/assets/img/icons/settings.svg';
import RecentTxImg from '@/assets/img/icons/recent-tx.svg';
import ArrowImg from '@/assets/img/icons/arrow-btn.svg';

interface ITradeBox {
  title: string;
  subtitle: string;
  settingsLink: string;
  recentTxLink: string;
  className?: string;
  titleBackLink?: boolean;
}

const TradeBox: React.FC<ITradeBox> = ({
  title,
  subtitle,
  settingsLink,
  recentTxLink,
  children,
  className,
  titleBackLink,
}) => {
  const history = useHistory();

  const handleBack = (): void => {
    if (titleBackLink) {
      history.goBack();
    }
  };

  return (
    <div className={cn('trade-box box-shadow box-white', className)}>
      <div className="trade-box__box-top box-f box-f-jc-sb">
        <div className="">
          <div
            className={cn('trade-box__title text-md text-purple text-med box-f-ai-c', {
              'box-pointer': titleBackLink,
            })}
            onClick={handleBack}
            onKeyDown={handleBack}
            role="link"
            tabIndex={0}
          >
            {titleBackLink ? <img src={ArrowImg} alt="" className="trade-box__back" /> : ''}
            <span>{title}</span>
          </div>
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
