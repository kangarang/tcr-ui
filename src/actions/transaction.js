export const SEND_TRANSACTION = 'SEND_TRANSACTION--Tx'
export const TXN_MINING = 'TXN_MINING--Tx'
export const TXN_MINED = 'TXN_MINED--Tx'
export const CLEAR_TXN = 'CLEAR_TXN--Tx'
export const TX_APPROVE = 'TX_APPROVE--Tx'
export const TX_APPLY = 'TX_APPLY--Tx'
export const TX_CHALLENGE = 'TX_CHALLENGE--Tx'
export const TX_UPDATE_STATUS = 'TX_UPDATE_STATUS--Tx'
export const TX_REQUEST_VOTING_RIGHTS = 'TX_REQUEST_VOTING_RIGHTS--Tx'
export const TX_COMMIT_VOTE = 'TX_COMMIT_VOTE--Tx'
export const TX_REVEAL_VOTE = 'TX_REVEAL_VOTE--Tx'

export function sendTransaction(payload) {
  return {
    type: SEND_TRANSACTION,
    payload,
  }
}
export function txnMining(payload) {
  return {
    type: TXN_MINING,
    payload,
  }
}
export function txnMined(payload) {
  return {
    type: TXN_MINED,
    payload,
  }
}
export function clearTxn(payload) {
  return {
    type: CLEAR_TXN,
    payload,
  }
}

export function requestApproval(amount) {
  return {
    type: TX_APPROVE,
    amount,
  }
}

export function txRequestVotingRights(payload) {
  return {
    type: TX_REQUEST_VOTING_RIGHTS,
    payload,
  }
}

export function updateStatus(listing) {
  return {
    type: TX_UPDATE_STATUS,
    listing,
  }
}

export function txCommitVote(payload) {
  return {
    type: TX_COMMIT_VOTE,
    payload,
  }
}
export function txRevealVote(payload) {
  return {
    type: TX_REVEAL_VOTE,
    payload,
  }
}
export function txChallenge(payload) {
  return {
    type: TX_CHALLENGE,
    payload,
  }
}
export function txApply(payload) {
  return {
    type: TX_APPLY,
    payload,
  }
}
