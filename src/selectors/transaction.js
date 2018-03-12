import { createSelector } from 'reselect'

export const selectTransaction = state => state.get('transaction')

export const selectLatestTxn = createSelector(selectTransaction, txnState =>
  txnState.get('latestTxn')
)

export const selectMiningStatus = createSelector(selectTransaction, txnState =>
  txnState.get('miningStatus')
)