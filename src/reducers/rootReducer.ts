import { combineReducers } from 'redux';

import mockReducer from '@/reducers/mockReducer';

const rootReducer = combineReducers({
  // list of reducers
  mockReducer,
});

type RootReducerType = typeof rootReducer;

export type AppStateType = ReturnType<RootReducerType>;

export default rootReducer;
