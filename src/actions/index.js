import {
  CONTRACT_ERROR,
  LOGS_ERROR,
  GET_ETHEREUM,

  SET_ETHJS,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  SET_LOGS,
  SET_DECODED_LOGS,

  TX_APPROVE,
  TX_APPLY,
  TX_CHALLENGE,
  TX_COMMIT_VOTE,
  TX_UPDATE_STATUS,
  TX_CHECK_TEST,

  NEW_ITEM,
  CHANGE_ITEM,
  CHANGE_ITEMS,
} from './constants'


export function setEthjs(ethjs, parameters) {
  return {
    type: SET_ETHJS,
    ethjs,
    parameters,
  }
}

export function logsError(logType, error) {
  return {
    type: LOGS_ERROR,
    logType,
    error,
  }
}
export function contractError(error) {
  return {
    type: CONTRACT_ERROR,
    error,
  }
}

// Housekeeping
export function setMinDeposit(minDeposit) {
  return {
    type: SET_MIN_DEPOSIT,
    minDeposit,
  }
}

// User interactions
export function applyDomain(domain, deposit) {
  return {
    type: TX_APPLY,
    domain,
    deposit,
  }
}
export function challengeDomain(domain) {
  return {
    type: TX_CHALLENGE,
    domain,
  }
}
export function commitVote(domain, pollID, amount) {
  return {
    type: TX_COMMIT_VOTE,
    domain,
    pollID,
    amount,
  }
}

// Token actions
export function requestApproval(amount) {
  return {
    type: TX_APPROVE,
    amount,
  }
}
export function setTokensAllowed(payload) {
  return {
    type: SET_TOKENS_ALLOWED,
    payload,
  }
}
export function setDecodedLogs(payload) {
  return {
    type: SET_DECODED_LOGS,
    payload,
  }
}
export function newItem(payload) {
  return {
    type: NEW_ITEM,
    payload,
  }
}
export function updateItems(payload) {
  return {
    type: CHANGE_ITEMS,
    payload,
  }
}
export function updateItem(payload) {
  return {
    type: CHANGE_ITEM,
    payload,
  }
}

export function checkTest(domain) {
  return {
    type: TX_CHECK_TEST,
    domain,
  }
}
export function updateStatus(domain) {
  return {
    type: TX_UPDATE_STATUS,
    domain,
  }
}