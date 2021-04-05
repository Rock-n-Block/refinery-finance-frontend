import React from 'react';
import { NavLink } from 'react-router-dom';

export interface NavItem {
  title: string;
  path: string;
}

export const Navigation: React.FC = () => {
  const tabs: Array<NavItem> = [
    {
      title: 'Первая страница',
      path: '/first-page',
    },
    {
      title: 'Вторая страница',
      path: '/second-page',
    },
  ];

  return (
    <div>
      {tabs.map(({ title, path }) => {
        return (
          <NavLink exact key={title} to={path}>
            {title}
          </NavLink>
        );
      })}
    </div>
  );
};
