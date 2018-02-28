const STATUS = 'STATUS'

const initialState = {
  pending: false,
}

export default (state = initialState, action) => {
  if (!action) return state
  switch (action.type) {
    case STATUS:
      return { ...state, pending: action.pending }
    default:
      return state
  }
}

export const showMetamaskOverlay = (status) => {
  return {
    type: STATUS,
    pending: status,
  }
}