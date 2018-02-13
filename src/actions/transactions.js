import {
  TX_APPROVE,
  TX_APPLY,
  TX_CHALLENGE,
  TX_COMMIT_VOTE,
  TX_REVEAL_VOTE,
  TX_UPDATE_STATUS,
  TX_REQUEST_VOTING_RIGHTS,
} from './constants'

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