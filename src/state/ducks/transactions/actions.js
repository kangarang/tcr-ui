import types from './types'

const sendTransaction = payload => ({
  type: types.SEND_TRANSACTION,
  payload,
})
const txnMining = payload => ({
  type: types.TXN_MINING,
  payload,
})
const txnMined = payload => ({
  type: types.TXN_MINED,
  payload,
})
const clearTxn = payload => ({
  type: types.CLEAR_TXN,
  payload,
})
const requestApproval = payload => ({
  type: types.TX_APPROVE,
  payload,
})
const txRequestVotingRights = payload => ({
  type: types.TX_REQUEST_VOTING_RIGHTS,
  payload,
})
const updateStatus = listing => ({
  type: types.TX_UPDATE_STATUS,
  listing,
})
const txCommitVote = payload => ({
  type: types.TX_COMMIT_VOTE,
  payload,
})
const txRevealVote = payload => ({
  type: types.TX_REVEAL_VOTE,
  payload,
})
const txChallenge = payload => ({
  type: types.TX_CHALLENGE,
  payload,
})
const txApply = payload => ({
  type: types.TX_APPLY,
  payload,
})

export default {
  sendTransaction,
  txnMining,
  txnMined,
  clearTxn,
  requestApproval,
  txRequestVotingRights,
  updateStatus,
  txCommitVote,
  txRevealVote,
  txChallenge,
  txApply,
}
