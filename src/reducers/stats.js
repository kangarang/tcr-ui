import { fromJS } from 'immutable'

const initialState = fromJS({
  txnStatus: {
    open: false,
    message: '',
  },
})

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
