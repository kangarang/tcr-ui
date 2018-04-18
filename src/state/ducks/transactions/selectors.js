import { createSelector } from 'reselect'

export const selectTransaction = state => state.transaction

export const selectLatestTxn = createSelector(selectTransaction, txnState => txnState.latestTxn)

export const selectMiningStatus = createSelector(
  selectTransaction,
  txnState => txnState.miningStatus
)
