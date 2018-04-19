import { createSelector } from 'reselect'

export const selectTransactions = state => state.get('transactions')

export const selectLatestTxn = createSelector(selectTransactions, txnsState =>
  txnsState.get('latestTxn')
)

export const selectMiningStatus = createSelector(selectTransactions, txnsState =>
  txnsState.get('miningStatus')
)
