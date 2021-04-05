import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from '@/store/store';

import { AppView } from './AppView';

import './App.scss';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppView />
      </BrowserRouter>
    </Provider>
  );
};
