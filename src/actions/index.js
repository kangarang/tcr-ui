import {
  CONTRACT_ERROR,
  LOGS_ERROR,
  UDAPP_ERROR,
  GET_ETHEREUM,

  SET_ETHJS,
  SET_WALLET,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  GET_TOKENS_ALLOWED,
  SET_TOKENS_ALLOWED,
  GET_PROVIDER_REQUEST,
  // SET_LOGS,
  POLL_LOGS_REQUEST,
  SET_DECODED_LOGS,
  NEW_ARRAY,

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


export function setupEthereum() {
  return {
    type: GET_ETHEREUM,
  }
}
export function setContracts(payload) {
  return {
    type: SET_CONTRACTS,
    payload,
  }
}
export function setWallet(payload) {
  return {
    type: SET_WALLET,
    payload,
  }
}
export function setEthjs(payload) {
  return {
    type: SET_ETHJS,
    payload,
  }
}

export function pollLogsRequest(payload) {
  return {
    type: POLL_LOGS_REQUEST,
    payload
  }
}
export function udappError(error) {
  return {
    type: UDAPP_ERROR,
    error,
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
export function getProviderRequest() {
  return {
    type: GET_PROVIDER_REQUEST,
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
export function applyListing(listing, deposit) {
  return {
    type: TX_APPLY,
    listing,
    deposit,
  }
}
export function challengeListing(listing) {
  return {
    type: TX_CHALLENGE,
    listing,
  }
}
export function commitVote(listing, pollID, amount) {
  return {
    type: TX_COMMIT_VOTE,
    listing,
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
export function getTokensAllowed(payload) {
  return {
    type: GET_TOKENS_ALLOWED,
    payload,
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
export function newArray(payload) {
  return {
    type: NEW_ARRAY,
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

export function checkTest(listing) {
  return {
    type: TX_CHECK_TEST,
    listing,
  }
}
export function updateStatus(listing) {
  return {
    type: TX_UPDATE_STATUS,
    listing,
  }
}