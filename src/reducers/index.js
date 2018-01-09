// import { fromJS } from 'immutable';

// Redux expects the state tree to be a plain JS object. Nope.
import { combineReducers } from 'redux-immutable';

import homeReducer from './home';
import udappReducer from './udapp';

// home -> state.get('home')
// export default function createReducer(injectedReducers) {
export default function createReducer() {
  return combineReducers({
    home: homeReducer,
    udapp: udappReducer,
    // ...injectedReducers,
  });
}
