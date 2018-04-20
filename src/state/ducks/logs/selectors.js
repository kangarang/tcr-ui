import { createSelector } from 'reselect'

export const selectLogs = state => state.get('logs')
