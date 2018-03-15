import { fromJS } from 'immutable'

const initialState = fromJS({
  stats: [],
})

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
