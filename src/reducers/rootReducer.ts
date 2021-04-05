import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  // list of reducers
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
