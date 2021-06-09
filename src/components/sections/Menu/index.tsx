import React from 'react';
import { NavLink } from 'react-router-dom';
import nextId from 'react-id-generator';

import './Menu.scss';

import LogoImg from '@/assets/img/icons/logo.svg';
import LogoMiniImg from '../../../assets/img/icons/logo-m.svg';
import HomeImg from '../../../assets/img/icons/home.svg';
import TradeImg from '../../../assets/img/icons/trade.svg';
import FarmsImg from '../../../assets/img/icons/farms.svg';
import LotteryImg from '../../../assets/img/icons/lottery.svg';
import { ReactComponent as TgImg } from '../../../assets/img/icons/tg.svg';
import { ReactComponent as TwImg } from '../../../assets/img/icons/tw.svg';

const Menu: React.FC = React.memo(() => {
  const navItems = [
    {
      text: 'Home',
      link: '/',
      img: HomeImg,
    },
    {
      text: 'Trade',
      link: '/trade/swap',
      activePaths: [
        '/trade/swap',
        '/trade/liquidity',
        '/trade/bridge',
        '/trade/swap/settings',
        '/trade/swap/history',
      ],
      img: TradeImg,
    },
    {
      text: 'Farms',
      link: '/farms',
      img: FarmsImg,
    },
    {
      text: 'Lottery',
      link: '/lottery',
      img: LotteryImg,
    },
  ];
  return (
    <div className="menu box-f-fd-c">
      <img src={LogoImg} alt="refinery finance" className="menu__logo" />
      <div className="menu__nav">
        {navItems.map((item) => (
          <NavLink
            exact
            to={item.link}
            className="menu__nav-item"
            key={nextId()}
            isActive={(_, location) => {
              if (item.activePaths && item.activePaths.includes(location.pathname)) {
                return true;
              }
              return item.link === location.pathname;
            }}
          >
            <div className="menu__nav-item-box box-f-ai-c">
              <div className="menu__nav-item-img box-f-c">
                <img src={item.img} alt="" />
              </div>
              <span className="text-purple">{item.text}</span>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="menu__balance box-purple-l box-f-ai-c">
        <img src={LogoMiniImg} alt="refinery finance" className="menu__balance-img" />
        <span className="text-purple">$37.166</span>
      </div>
      <div className="menu__socials box-f-ai-c">
        <a href="/" className="menu__socials-item menu__socials-item-tg box-f-c">
          <TgImg />
        </a>
        <a href="/" className="menu__socials-item box-f-c">
          <TwImg />
        </a>
      </div>
    </div>
  );
});

export default Menu;
