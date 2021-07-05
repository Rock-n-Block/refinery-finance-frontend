import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';

import { Popover } from '../../../atoms';

import './TradeBox.scss';

import SettingsImg from '@/assets/img/icons/settings.svg';
import RecentTxImg from '@/assets/img/icons/recent-tx.svg';
import ArrowImg from '@/assets/img/icons/arrow-btn.svg';
import InfoImg from '@/assets/img/icons/info.svg';

interface ITradeBox {
  title: string;
  subtitle?: string;
  settingsLink?: string;
  recentTxLink?: string;
  className?: string;
  titleBackLink?: boolean;
  info?: string;
}

const TradeBox: React.FC<ITradeBox> = ({
  title,
  subtitle,
  settingsLink,
  recentTxLink,
  children,
  className,
  titleBackLink,
  info,
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
          {subtitle ? (
            <div className="trade-box__subtitle text-gray box-f-ai-c">
              <span>{subtitle}</span>

              {info ? (
                <Popover content={<span className="text-med text text-purple">{info}</span>}>
                  <img src={InfoImg} alt="" />
                </Popover>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </div>
        {recentTxLink && settingsLink ? (
          <div className="box-f-ai-c">
            {settingsLink ? (
              <Link to={settingsLink} className="trade-box__icon">
                <img src={SettingsImg} alt="advanced settings" />
              </Link>
            ) : (
              ''
            )}
            {recentTxLink ? (
              <Link to={recentTxLink} className="trade-box__icon">
                <img src={RecentTxImg} alt="advanced settings" />
              </Link>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
      </div>
      {children}
    </div>
  );
};

export default TradeBox;
