import EthAbi from 'ethjs-abi'

import { select, put, call, takeEvery } from 'redux-saga/effects'
import {
  SEND_TRANSACTION,
  CALL_REQUESTED,
} from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
} from '../selectors'

import vote_utils from '../utils/vote_utils'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './vote';
import { txnMined } from '../actions';

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

// TODO: write tests for these sagas. against abis
function* handleSendTransaction(action) {
  const methodName = action.payload.method.name
  if (methodName === 'apply' || methodName === 'challenge' || methodName === 'updateStatus') {
    yield call(registryTxnSaga, action)
  } else if (methodName === 'requestVotingRights') {
    yield call(requestVotingRightsSaga, action)
  } else if (methodName === 'commitVote') {
    yield call(commitVoteSaga, action)
  } else if (methodName === 'revealVote') {
    yield call(revealVoteSaga, action)
  } else {
    yield call(sendDefaultTxn, action)
  }
}

function* registryTxnSaga(action) {
  const registry = yield select(selectRegistry)
  const txData = EthAbi.encodeMethod(action.payload.method, action.payload.args)
  const to = registry.address
  yield call(sendTransactionSaga, registry, action.payload.method.name, action.payload.args)
  // yield call(sendTransactionSaga, txData, to)
}

export function* sendDefaultTxn(action) {
  try {
    const to = action.payload.to
    const txData = EthAbi.encodeMethod(action.payload.method, action.payload.args)
    yield call(sendDefTransactionSaga, txData, to)
  } catch (error) {
    console.log('error', error)
  }
}

export function* sendTransactionSaga(contract, method, args) {
  try {
    const newArgs = args.map(rg => {
      if (typeof rg === 'object') {
        return rg.toString()
      }
      return rg
    })
    const receipt = yield call(contract.contract[method], ...newArgs)
    if (receipt.receipt.status !== '0x00') {
      yield put(txnMined(receipt))
    } else {
      console.log('ERROR')
    }
    console.log('receipt', receipt)
  } catch (error) {
    console.log('error', error)
  }
}
export function* sendDefTransactionSaga(data, to) {
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
    const txHash = yield call(ethjs.sendTransaction, payload)
    return txHash
  } catch (error) {
    console.log('error', error)
  }
}
