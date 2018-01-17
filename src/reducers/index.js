import { combineReducers } from 'redux-immutable'
import homeReducer from './home'
import udappReducer from './udapp'

export default function createReducer() {
  return combineReducers({
    home: homeReducer,
    udapp: udappReducer,
  })
}
