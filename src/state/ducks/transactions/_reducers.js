import { combineReducers } from 'redux'
import types from './types'

/* State Shape
{
    quacking: bool,
    distance: number
}
*/

const quackReducer = (state = false, action) => {
  switch (action.type) {
    case types.QUACK:
      return true
    /* ... */
    default:
      return state
  }
}

const distanceReducer = (state = 0, action) => {
  switch (action.type) {
    case types.SWIM:
      return state + action.payload.distance
    /* ... */
    default:
      return state
  }
}

// In case the state shape is more complex, you should break the reducers into multiple smaller functions that deal with a slice of the state, then combine them at the end.

const reducer = combineReducers({
  quacking: quackReducer,
  distance: distanceReducer,
})

export default reducer

import { combineReducers } from 'redux'
import * as types from './types'
import { createReducer } from '../../utils'

/* State shape
{
    details: product,
    list: [ product ],
}
*/

// const detailsReducer = createReducer( null )( {
//     [ types.FETCH_DETAILS_COMPLETED ]: ( state, action ) => action.payload.product,
// } );

// const listReducer = createReducer( [ ] )( {
//     [ types.FETCH_LIST_COMPLETED ]: ( state, action ) => action.payload.products,
// } );

// export default combineReducers( {
//     details: detailsReducer,
//     list: listReducer,
// } );
