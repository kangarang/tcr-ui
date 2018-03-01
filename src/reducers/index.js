import { combineReducers } from 'redux-immutable'
import home from './home'
import miningStatus from './miningStatus'
import udapp from './udapp'

export default function createReducer() {
  return combineReducers({
    home,
    miningStatus,
    udapp,
  })
}
