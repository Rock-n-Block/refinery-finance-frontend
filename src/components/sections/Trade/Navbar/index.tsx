import React from 'react';
import nextId from 'react-id-generator';
import { NavLink } from 'react-router-dom';

import './Navbar.scss';

const TradeNavbar: React.FC = () => {
  const navItems = ['Swap', 'Liquidity'];
  return (
    <div className="trade__nav box-shadow box-f-ai-c">
      {navItems.map((item) => (
        <NavLink
          to={`/trade/${item.toLocaleLowerCase()}`}
          className="trade__nav-item text-gray text-med"
          key={nextId()}
        >
          {item}
        </NavLink>
      ))}
    </div>
  );
};

export default TradeNavbar;
