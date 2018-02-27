import EthAbi from 'ethjs-abi'

import { select, call, takeEvery } from 'redux-saga/effects'
import {
  SEND_TRANSACTION,
  CALL_REQUESTED,
} from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
  selectToken,
} from '../selectors'

import { toNaturalUnitAmount } from '../utils/units_utils'

import vote_utils from '../utils/vote_utils'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './vote';

export default function* udappSaga() {
  yield takeEvery(SEND_TRANSACTION, handleSendTransaction)
  yield takeEvery(CALL_REQUESTED, callUDappSaga)
}

function* callUDappSaga(action) {
  console.log('call requested:', action)
  const ethjs = yield select(selectEthjs)
  const account = yield select(selectAccount)

  let contract
  if (action.payload.contract === 'registry') {
    contract = yield select(selectRegistry)
  } else if (action.payload.contract === 'voting') {
    contract = yield select(selectVoting)
  }

  const method = action.payload.method
  const args = action.payload.args
  if (method.inputs[0].name === '_listingHash') {
    args[0] = vote_utils.getListingHash(args[0])
  }
  const txData = yield call(EthAbi.encodeMethod, method, args)

  const payload = {
    from: account,
    to: contract.address,
    data: txData,
  }

  const result = yield call(ethjs.call, payload, 'latest')
  const decint = parseInt(result, 10)
  const hexint = parseInt(result, 16)
  console.log('CALL result (dec):', decint)
  console.log('CALL result (hex):', hexint)

  const callResult = hexint === 0 ? 'false' : hexint === 1 ? 'true' : decint
  alert(callResult)
}


function* handleSendTransaction(action) {
  console.log('handleSendTransaction saga:', action)
  if (action.method === 'apply') {
    yield call(applySaga, action)
  } else if (action.method === 'challenge') {
    yield call(challengeSaga, action)
  } else if (action.payload.method.name === 'requestVotingRights') {
    yield call(requestVotingRightsSaga, action)
  } else if (action.payload.method.name === 'commitVote') {
    yield call(commitVoteSaga, action)
  } else if (action.payload.method.name === 'revealVote') {
    yield call(revealVoteSaga, action)
  } else {
    yield call(sendOtherTransaction, action)
  }
}

function* applySaga(action) {
  const registry = yield select(selectRegistry)

  const listingString = action.payload.args[0]
  const actualAmount = toNaturalUnitAmount(action.payload.args[1], 18)
  const listingHash = vote_utils.getListingHash(listingString)

  const finalArgs = [listingHash, actualAmount, listingString]

  const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)
  const to = registry.address

  yield call(sendTransactionSaga, txData, to)
}

function* challengeSaga(action) {
  const listingString = action.payload.args[0]
  const listingHash = vote_utils.getListingHash(listingString)
  const finalArgs = [listingHash, listingString]

  const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)

  const registry = yield select(selectRegistry)

  yield call(sendTransactionSaga, txData, registry.address)
}

export function* sendTransactionSaga(data, to) {
  try {
    const ethjs = yield select(selectEthjs)
    const from = yield select(selectAccount)
    const nonce = yield call(ethjs.getTransactionCount, from)
    const payload = {
      to,
      from,
      gas: 450000,
      gasPrice: 25000000000,
      nonce,
      data,
    }
    console.log('payload', payload)

    const txHash = yield call(ethjs.sendTransaction, payload)
    console.log('txHash', txHash)
    return txHash
  } catch (error) {
    console.log('error', error)
  }
}




function* sendOtherTransaction(action) {
  try {
    const ethjs = yield select(selectEthjs)
    const from = yield select(selectAccount)
    const registry = yield select(selectRegistry)
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)

    const nonce = yield call(ethjs.getTransactionCount, from)
    const args = action.payload.args
    const inputNames = action.payload.method.inputs.map(inp => inp.name)

    if (inputNames.includes('_listingHash')) {
      const indexOfListingHash = inputNames.indexOf('_listingHash')
      const listingString = args[indexOfListingHash]
      args[indexOfListingHash] = vote_utils.getListingHash(listingString)
      if (inputNames.includes('_data')) {
        const indexOfData = inputNames.indexOf('_data')
        args[indexOfData] = listingString
      }
    }

    if (inputNames.includes('_amount')) {
      const indexOfAmount = inputNames.indexOf('_amount')
      const actualAmount = toNaturalUnitAmount(
        args[indexOfAmount],
        18
      )
      args[indexOfAmount] = actualAmount.toString(10)
    }
    if (inputNames.includes('_value')) {
      const indexOfValue = inputNames.indexOf('_value')
      const actualValue = toNaturalUnitAmount(
        args[indexOfValue],
        18
      )
      args[indexOfValue] = actualValue.toString(10)
    }
    if (
      inputNames.includes(
        '_numTokens' &&
        (action.payload.method.name === 'requestVotingRights' ||
          action.payload.method.name === 'withdrawVotingRights')
      )
    ) {
      const indexOfNumTokens = inputNames.indexOf('_numTokens')
      const actualNumTokens = toNaturalUnitAmount(
        args[indexOfNumTokens],
        18
      )
      args[indexOfNumTokens] = actualNumTokens.toString(10)
    }
    let contract
    if (action.payload.contract === 'token') {
      contract = token
    } else if (action.payload.contract === 'voting') {
      contract = voting
    } else {
      contract = registry
    }

    const data = EthAbi.encodeMethod(action.payload.method, args)

    const payload = {
      to: contract.address,
      from,
      gas: 450000,
      gasPrice: 25000000000,
      nonce,
      data,
    }

    const txHash = yield call(ethjs.sendTransaction, payload)
    console.log('txHash', txHash)
  } catch (error) {
    console.log('error', error)
  }
}
