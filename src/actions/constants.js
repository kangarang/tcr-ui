// Ethereum
export const SET_ADDRESS = 'SET_ADDRESS--|--ETH'
export const GET_ETH_PROVIDER = 'GET_ETH_PROVIDER--|--ETH'
export const SET_FROM_ADDRESS = 'SET_FROM_ADDRESS--|--ETH'
export const REFRESH_ETH_STORE = 'REFRESH_ETH_STORE--|--ETH'

// Errors
export const CONTRACT_ERROR = 'CONTRACT_ERROR--|--Error'
export const LOGS_ERROR = 'LOGS_ERROR--|--Error'
export const LOGIN_ERROR = 'LOGIN_ERROR--|--Error'
export const UDAPP_ERROR = 'UDAPP_ERROR--|--Error'

// Home
export const UPDATE_BALANCES_REQUEST = 'UPDATE_BALANCES_REQUEST--|--TOKEN'
export const UPDATE_BALANCES = 'UPDATE_BALANCES--|--TOKEN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS--|--Home'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS--|--Home'
export const WALLET_ERROR = 'WALLET_ERROR--|--Home'
export const GET_ETHEREUM = 'GET_ETHEREUM--|--Home'
export const GET_TOKENS_ALLOWED = 'GET_TOKENS_ALLOWED--|--Home'
export const CHANGE_SLIDER_VALUE = 'CHANGE_SLIDER_VALUE--|--Home'
export const SET_ETHEREUM_PROVIDER = 'SET_ETHEREUM_PROVIDER--|--Home'
export const SET_CUSTOM_METHODS = 'SET_CUSTOM_METHODS--|--Home'
export const REQUEST_MODAL_METHOD = 'REQUEST_MODAL_METHOD--|--Home'
export const CLICK_ACTION_REQUEST = 'CLICK_ACTION_REQUEST--|--Home'
export const SET_WALLET = 'SET_WALLET--|--Home'
export const SET_CONTRACTS = 'SET_CONTRACTS--|--Home'
export const SET_MIN_DEPOSIT = 'SET_MIN_DEPOSIT--|--Home'

export const SET_METHOD_ARGS = 'SET_METHOD_ARGS--|--Contract'
export const EXECUTE_METHOD_REQUEST = 'EXECUTE_METHOD_REQUEST--|--Contract'
export const POLL_LOGS_REQUEST = 'POLL_LOGS_REQUEST--|--Contract'

// call / txn
export const SEND_TRANSACTION = 'SEND_TRANSACTION--|--Home'
export const CALL_REQUESTED = 'CALL_REQUESTED--|--Home'

// Token
export const SET_TOKENS_ALLOWED = 'SET_TOKENS_ALLOWED--|--Token'
export const TX_APPROVE = 'TX_APPROVE--|--Token'

// Registry
export const TX_APPLY = 'TX_APPLY--|--Registry'
export const TX_CHALLENGE = 'TX_CHALLENGE--|--Registry'
export const TX_UPDATE_STATUS = 'TX_UPDATE_STATUS--|--Registry'

// Voting
export const TX_REQUEST_VOTING_RIGHTS = 'TX_REQUEST_VOTING_RIGHTS--|--Vote'
export const TX_COMMIT_VOTE = 'TX_COMMIT_VOTE--|--Vote'
export const TX_REVEAL_VOTE = 'TX_REVEAL_VOTE--|--Vote'

export const NEW_ARRAY = 'NEW_ARRAY--|--Reducer'
export const CHANGE_ITEMS = 'CHANGE_ITEMS--|--Reducer'
export const DELETE_LISTINGS = 'DELETE_LISTINGS--|--Home'

// Events
export const EV_APPLICATION = 'EV_APPLICATION--|--Registry'
export const EV_CHALLENGE = 'EV_CHALLENGE--|--Registry'
export const EVENT_FROM_REGISTRY = 'EVENT_FROM_REGISTRY--|--Registry'
export const EVENT_FACEOFF = 'EVENT_FACEOFF--|--RegistryChallenge'
export const EVENT_WHITELIST = 'EVENT_WHITELIST--|--RegistryWhitelist'