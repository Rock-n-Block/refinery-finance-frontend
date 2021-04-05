import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { FirstPage } from '@/components/FirstPage/FirstPage';
import { NoPageFound } from '@/components/NoPageFound/NoPageFound';
import { SecondPage } from '@/components/SecondPage/SecondPage';

export const Main = (): React.ReactElement => (
  <Switch>
    {/* <Redirect from="/" to="/first-page" /> */}
    <Route exact path="/" component={FirstPage} />
    <Route exact path="/first-page" component={FirstPage} />
    <Route exact path="/second-page" component={SecondPage} />
    <Route component={NoPageFound} />
  </Switch>
);
