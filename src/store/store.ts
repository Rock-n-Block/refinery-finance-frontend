import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';

import rootReducer from '../reducers/rootReducer';

const logger = createLogger({
  collapsed: true,
});

const middlewares: Array<Middleware | ThunkMiddleware> = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = (preloadedState?: any): Store<any> => {
  return createStore(rootReducer, preloadedState, applyMiddleware(...middlewares));
};

export default store();
