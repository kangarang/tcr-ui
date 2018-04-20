// import { createSelector } from 'reselect'

function selectLogs(state) {
  return state.get('logs')
}

export { selectLogs }
