// import { fromJS } from 'immutable';

// Redux expects the state tree to be a plain JS object. Nope.
import { combineReducers } from 'redux-immutable';

import homeReducer from './home';

// home -> state.get('home')
// export default function createReducer(injectedReducers) {
export default function createReducer() {
  return combineReducers({
    home: homeReducer,
    // ...injectedReducers,
  });
}
