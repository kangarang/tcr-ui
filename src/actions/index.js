import {
  CONTRACT_ERROR,
  LOGS_ERROR,
  GET_ETHEREUM,
  CHECK_PROVIDER,
  CHANGE_DOMAIN,
  CHANGE_AMOUNT,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  SET_DECODED_LOGS,
  SET_ETHJS,
  GET_TOKENS_ALLOWED,
  SET_TOKENS_ALLOWED,
  TX_APPLY,
  TX_CHECK_TEST,
  TX_CHALLENGE,
  TX_APPROVE,
  TX_COMMIT_VOTE,
  SET_VISIBILITY_FILTER,
  SET_STATUS_UPDATE,
  SET_NEW_BUILT_FILTER,
  SET_LOGS,
  SET_CUSTOM_DOMAINS,
  GET_CUSTOM,
  GET_NEW_LOGS,
  TX_UPDATE_STATUS,
  SET_METHOD_SIGNATURES,
  EVENT_FROM_REGISTRY,
  EVENT_VOTING_ITEM,
  EVENT_WHITELIST,
  GET_ACCOUNTS_REQUEST,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_ERROR,
} from '../constants'

// Ethereum
export function checkProvider() {
  return {
    type: CHECK_PROVIDER,
  }
}
export function setupEthereum() {
  return {
    type: GET_ETHEREUM,
  }
}
export function setEthjs(ethjs, userInfo) {
  return {
    type: SET_ETHJS,
    ethjs,
    userInfo,
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

export function setContracts(contracts) {
  return {
    type: SET_CONTRACTS,
    contracts,
  }
}

// User interactions
export function changeAmount(amount) {
  return {
    type: CHANGE_AMOUNT,
    amount,
  }
}
export function changeDomain(domain) {
  return {
    type: CHANGE_DOMAIN,
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

// Token actions
export function requestApproval(amount) {
  return {
    type: TX_APPROVE,
    amount,
  }
}
export function setTokensAllowed(allowed) {
  return {
    type: SET_TOKENS_ALLOWED,
    allowed,
  }
}
export function getTokensAllowed() {
  return {
    type: GET_TOKENS_ALLOWED,
  }
}
export function setDecodedLogs(payload) {
  return {
    type: SET_DECODED_LOGS,
    payload,
  }
}
export function getNewLogs(request) {
  return {
    type: GET_NEW_LOGS,
    request,
  }
}


// Events
export function eventFromRegistry(payload) {
  return {
    type: EVENT_FROM_REGISTRY,
    payload,
  }
}
export function eventVotingItem(payload) {
  return {
    type: EVENT_VOTING_ITEM,
    payload,
  }
}
export function eventWhitelist(payload) {
  return {
    type: EVENT_WHITELIST,
    payload,
  }
}

export function setMethodSignatures(payload) {
  return {
    type: SET_METHOD_SIGNATURES,
    payload,
  }
}

/*
 *
 * Visibility filter actions
 *
 */

export function setVFilter(vFilter) {
  return {
    type: SET_VISIBILITY_FILTER,
    vFilter,
  }
}

export function statusUpdate(domain, receipt) {
  return {
    type: SET_STATUS_UPDATE,
    domain,
    receipt,
  }
}

export function getAccountsRequest() {
  return {
    type: GET_ACCOUNTS_REQUEST,
  }
}
export function getAccountsError(payload) {
  return {
    type: GET_ACCOUNTS_ERROR,
    payload,
  }
}
export function getAccountsSuccess(payload) {
  return {
    type: GET_ACCOUNTS_SUCCESS,
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
export function setLogs(payload) {
  return {
    type: SET_LOGS,
    payload,
  }
}
export function getCustom(custom) {
  return {
    type: GET_CUSTOM,
    custom,
  }
}
export function setCustomDomains(customDomains) {
  return {
    type: SET_CUSTOM_DOMAINS,
    customDomains,
  }
}

export function setNewBuiltFilter(vFilter, builtFilter) {
  return {
    type: SET_NEW_BUILT_FILTER,
    vFilter,
    builtFilter,
  }
}
