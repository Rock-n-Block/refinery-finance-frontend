import React from 'react';
import nextId from 'react-id-generator';
import { NavLink } from 'react-router-dom';

import { onCheckCondition } from '@/utils/checkActivePathName';

import './Navbar.scss';

const TradeNavbar: React.FC = () => {
  const navItems = ['Swap', 'Liquidity'];
  return (
    <div className="trade__nav box-shadow box-f-ai-c">
      {navItems.map((item) => {
        const { pathname } = window.location;
        const activePath = item === 'Swap' ? '/' : '/liquidity';

        return (
          <NavLink
            to={activePath}
            className="trade__nav-item text-gray text-med"
            key={nextId()}
            isActive={() => onCheckCondition(pathname, activePath)}
          >
            {item}
          </NavLink>
        );
      })}
    </div>
  );
};

export default TradeNavbar;
