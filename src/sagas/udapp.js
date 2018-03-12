import _ from 'lodash'

import { select, put, call, takeEvery } from 'redux-saga/effects'
import { SEND_TRANSACTION, CALL_REQUESTED } from '../actions/constants'

import {
  selectProvider,
  selectAccount,
  selectRegistry,
  selectVoting,
  selectToken,
} from '../selectors'

import { getListingHash } from 'utils/_values'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './vote'
import { txnMining, txnMined, clearTxn } from '../actions/transactions'
import { ipfsAddSaga } from './ipfs'
import { delay } from 'redux-saga'

function* callUDappSaga(action) {
  console.log('call requested:', action)
  const account = yield select(selectAccount)
  console.log('account', account)
  // const { method, args, contract } = action.payload

  // let c
  // if (contract === 'registry') {
  //   c = yield select(selectRegistry)
  // } else if (contract === 'voting') {
  //   c = yield select(selectVoting)
  // }

  // // hash the string
  // if (method.inputs[0].name === '_listingHash') {
  //   args[0] = getListingHash(args[0])
  // }
  // const decint = parseInt(result, 10)
  // const hexint = parseInt(result, 16)
  // console.log('CALL result (dec):', decint)
  // console.log('CALL result (hex):', hexint)

  // const callResult = hexint === 0 ? 'false' : hexint === 1 ? 'true' : decint
  // alert(callResult)
}

export default function* udappSaga() {
  yield takeEvery(SEND_TRANSACTION, handleSendTransaction)
  yield takeEvery(CALL_REQUESTED, callUDappSaga)
}

// TODO: write tests for these sagas. against abis
function* handleSendTransaction(action) {
  const methodName = action.payload.methodName
  if (
    methodName === 'apply' ||
    methodName === 'challenge' ||
    methodName === 'updateStatus'
  ) {
    yield call(registryTxnSaga, action)
  } else if (methodName === 'requestVotingRights') {
    yield call(requestVotingRightsSaga, action)
  } else if (methodName === 'commitVote') {
    yield call(commitVoteSaga, action)
  } else if (methodName === 'revealVote') {
    yield call(revealVoteSaga, action)
  } else {
    yield call(sendContractTxn, action)
  }
}

function* registryTxnSaga(action) {
  const registry = yield select(selectRegistry)
  const methodName = action.payload.methodName

  let args = action.payload.args.map(arg => {
    if (_.isObject(arg)) {
      return arg.toString()
    } else if (_.isString(arg)) {
      return arg
    }
    // TODO: more typechecking
    return arg
  })

  if (methodName === 'apply') {
    const fileHash = yield call(ipfsAddSaga, {
      payload: { id: args[0], data: args[2] },
    })
    // hash the string
    args[0] = getListingHash(args[0])
    // use ipfs CID as the _data field in the application
    args[2] = fileHash
  }

  yield call(sendTransactionSaga, registry, methodName, args)
}

export function* sendContractTxn(action) {
  try {
    const { methodName, args, contract } = action.payload
    let c
    if (contract === 'registry') {
      c = yield select(selectRegistry)
    } else if (contract === 'voting') {
      c = yield select(selectVoting)
    } else if (contract === 'token') {
      c = yield select(selectToken)
    }
    if (methodName === 'approve') {
      c = yield select(selectToken)
    }
    yield call(sendTransactionSaga, c, methodName, args)
  } catch (error) {
    console.log('error', error)
  }
}

export function* sendTransactionSaga(contract, method, args) {
  try {
    const provider = yield select(selectProvider)
    const newArgs = args.map(rg => {
      if (_.isObject(rg)) {
        return rg.toString(10)
      } else if (_.isString(rg)) {
        return rg
      }
      return rg
    })

    const receipt = yield call(contract.functions[method], ...newArgs)
    console.log('receipt', receipt)
    yield put(txnMining())

    const minedTxn = yield provider.waitForTransaction(receipt.hash).then(function(transaction) {
      console.log('Transaction Mined: ' + transaction)
    })

    yield put(txnMined(minedTxn))
    yield call(delay, 3000)
    yield put(clearTxn(minedTxn))

    return minedTxn
  } catch (error) {
    console.log('error', error)
  }
}
