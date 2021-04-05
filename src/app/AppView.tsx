import React from 'react';

import { Main } from '@/components/Main/Main';
import { Navigation } from '@/components/Navigation/Navigation';

import './App.scss';

export const AppView = (): React.ReactElement => {
  return (
    <>
      <Navigation />
      <Main />
    </>
  );
};
