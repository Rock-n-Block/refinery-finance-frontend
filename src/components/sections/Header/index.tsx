import React, { useEffect, useState } from 'react';
import './Header.scss';
import logo from '@/assets/img/icons/logo-header.svg';

import { Menu } from '../index';
import { useMst } from '../../../store';
import { useWalletConnectorContext } from '../../../services/MetamaskConnect';
import { Button } from '../../atoms';

const Header: React.FC = React.memo(() => {
  const [isBurger, setIsBurger] = useState(false);

  const connector = useWalletConnectorContext();
  const { user } = useMst();

  const handleClose = () => {
    setIsBurger(false);
  };

  useEffect(() => {
    if (isBurger) {
      document.body.classList.add('hide-scroll');
    } else document.body.classList.remove('hide-scroll');
  }, [isBurger]);

  return (
    <>
      <section className="header">
        <div
          tabIndex={0}
          role="button"
          onKeyDown={() => {}}
          className={`header-burger ${isBurger && 'header-burger--active'}`}
          onClick={() => setIsBurger(!isBurger)}
        >
          <div className="header-burger__line header-burger__line--1" />
          <div className="header-burger__line header-burger__line--2" />
          <div className="header-burger__line header-burger__line--3" />
        </div>
        <div className="header-logo">
          <img src={logo} alt="logo" />
        </div>
      </section>
      <div className={`menu-mob ${isBurger && 'menu-mob--active'}`}>
        {!user.address ? (
          <Button className="header-mob__connect" onClick={connector.connect}>
            <span className="text-bold text-white">Connect Wallet</span>
          </Button>
        ) : (
          ''
        )}
        <Menu mobile onClick={handleClose} />
      </div>
    </>
  );
});

export default Header;
