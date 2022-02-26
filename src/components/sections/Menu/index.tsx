import React, { useMemo } from 'react';
import nextId from 'react-id-generator';
import { Link, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DaoImg from '@/assets/img/icons/dao.svg';
import LogoImg from '@/assets/img/icons/logo.svg';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { Precisions } from '@/types';

// import CollectiblesImg from '../../../assets/img/icons/collectibles.svg';
import FarmsImg from '../../../assets/img/icons/farms.svg';
// import HomeImg from '../../../assets/img/icons/home.svg';
import LogoMiniImg from '../../../assets/img/icons/logo-m.svg';
// import LotteryImg from '../../../assets/img/icons/lottery.svg';
import PoolsImg from '../../../assets/img/icons/pools.svg';
import TeamsImg from '../../../assets/img/icons/teams.svg';
import { ReactComponent as TgImg } from '../../../assets/img/icons/tg.svg';
import TradeImg from '../../../assets/img/icons/trade.svg';
import { ReactComponent as TwImg } from '../../../assets/img/icons/tw.svg';
import { useWalletConnectorContext } from '../../../services/MetamaskConnect';
import { useMst } from '../../../store';
import { Button } from '../../atoms';
import { WalletModal } from '..';

import './Menu.scss';

interface IMenuProps {
  onClick?: () => void;
}
const navItems = [
  // {
  //   text: 'Home',
  //   link: '/',
  //   img: HomeImg,
  // },
  {
    text: 'Trade',
    link: '/',
    activePaths: [
      '/',
      '/liquidity',
      '/liquidity/settings',
      '/liquidity/history',
      '/liquidity/find',
      '/liquidity/add',
      '/liquidity/remove',
      '/liquidity/receive',
      '/bridge',
      '/settings',
      '/history',
    ],
    img: TradeImg,
  },
  // {
  //   text: 'Trade',
  //   link: '/trade/swap',
  //   activePaths: [
  //     '/trade/swap',
  //     '/trade/liquidity',
  //     '/trade/liquidity/settings',
  //     '/trade/liquidity/history',
  //     '/trade/liquidity/find',
  //     '/trade/liquidity/add',
  //     '/trade/liquidity/remove',
  //     '/trade/liquidity/receive',
  //     '/trade/bridge',
  //     '/trade/swap/settings',
  //     '/trade/swap/history',
  //   ],
  //   img: TradeImg,
  // },
  {
    text: 'Farms',
    link: '/farms',
    img: FarmsImg,
  },
  // {
  //   text: 'Lottery',
  //   link: '/lottery',
  //   img: LotteryImg,
  // },
  {
    text: 'Pools',
    link: '/pools',
    img: PoolsImg,
  },
  // {
  //   text: 'Collectibles',
  //   link: '/collectibles',
  //   img: CollectiblesImg,
  // },
  {
    text: ' Profile',
    link: '/profile',
    img: TeamsImg,
  },
  // {
  //   text: 'Teams & Profile',
  //   link: '/teams',
  //   img: TeamsImg,
  // },
  {
    text: 'DAO',
    link: '/dao',
    img: DaoImg,
  },
];
const Menu: React.FC<IMenuProps> = observer(({ onClick }) => {
  const { connect } = useWalletConnectorContext();
  const { user } = useMst();

  const [isWalletModalVisible, setWalletModalVisible] = React.useState(false);
  const { tokenUsdPrice } = useRefineryUsdPrice();
  const priceToDisplay = useMemo(() => `$${Number(tokenUsdPrice).toFixed(Precisions.shortToken)}`, [
    tokenUsdPrice,
  ]);

  return (
    <>
      <div className="menu box-f-fd-c">
        <Link to="/">
          <img src={LogoImg} alt="refinery finance" className="menu__logo" />
        </Link>
        <div className="menu__nav">
          {navItems.map((item) => (
            <NavLink
              exact
              to={item.link}
              className="menu__nav-item"
              key={nextId()}
              onClick={onClick}
              isActive={(_, location) => {
                if (
                  (item.activePaths && item.activePaths.includes(location.pathname)) ||
                  (item.link !== '/' && location.pathname.indexOf(item.link) > -1)
                ) {
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
        <div className="menu__connect-box">
          {!user.address ? (
            <Button className="menu__connect" size="md" onClick={connect}>
              <span className="text-bold text-white">Connect Wallet</span>
            </Button>
          ) : (
            <Button className="menu__connect" size="md" onClick={() => setWalletModalVisible(true)}>
              <span className="text-bold text-white text-address">{user.address}</span>
            </Button>
          )}
        </div>
        <div className="menu__balance box-purple-l box-f-ai-c">
          <img src={LogoMiniImg} alt="refinery finance" className="menu__balance-img" />
          <span className="text-purple">{priceToDisplay}</span>
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
      {user.address ? (
        <WalletModal
          isVisible={isWalletModalVisible}
          handleClose={() => setWalletModalVisible(false)}
        />
      ) : (
        ''
      )}
    </>
  );
});

export default Menu;
