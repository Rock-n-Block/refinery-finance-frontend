import React, { useState } from 'react';
import './Header.scss';
import logo from '@/assets/img/icons/logo-header.svg';

import { Menu } from '../index';

const Header: React.FC = React.memo(() => {
  const [isBurger, setIsBurger] = useState(false);

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
      {isBurger && <Menu mobile />}
    </>
  );
});

export default Header;
