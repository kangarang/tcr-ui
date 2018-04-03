import { select, put, call, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import _ from 'lodash'

import { SEND_TRANSACTION } from 'actions/constants'
import { txnMining, txnMined, clearTxn } from 'actions/transactions'

import { selectProvider, selectRegistry, selectVoting, selectToken } from '../selectors'
import { ipfsAddData } from 'libs/ipfs'

import { getListingHash } from 'utils/_values'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from 'sagas/vote'
import { updateBalancesRequest } from '../actions'

export default function* transactionSaga() {
  yield takeEvery(SEND_TRANSACTION, handleSendTransaction)
}

// TODO: write tests for these sagas. against abis
export function* handleSendTransaction(action) {
  const { methodName, args } = action.payload
  const token = yield select(selectToken)
  const voting = yield select(selectVoting)
  const registry = yield select(selectRegistry)

  if (methodName === 'apply' || methodName === 'challenge' || methodName === 'updateStatus') {
    yield call(registryTxnSaga, action)
  } else if (methodName === 'requestVotingRights') {
    yield call(requestVotingRightsSaga, action)
  } else if (methodName === 'commitVote') {
    yield call(commitVoteSaga, action)
  } else if (methodName === 'revealVote') {
    yield call(revealVoteSaga, action)
  } else if (methodName === 'approve') {
    yield call(sendTransactionSaga, token, methodName, args)
  } else if (methodName === 'rescueTokens') {
    yield call(sendTransactionSaga, voting, methodName, args)
  } else if (methodName === 'claimVoterReward') {
    yield call(sendTransactionSaga, registry, methodName, args)
  } else {
    console.log('unknown methodName!?!?')
  }
}

export function* registryTxnSaga(action) {
  const registry = yield select(selectRegistry)
  const { methodName } = action.payload

  // typecheck arguments
  const args = action.payload.args.map(arg => {
    if (_.isObject(arg)) {
      return arg.toString()
    } else if (_.isString(arg)) {
      return arg
    }
    // TODO: more typechecking
    return arg
  })

  let finalArgs = _.clone(args)

  if (methodName === 'apply') {
    const fileHash = yield call(ipfsAddData, {
      id: args[0], // listing string (name)
      data: args[2], // data (address)
    })
    // hash the string
    finalArgs[0] = getListingHash(args[0])
    // use ipfs CID as the _data field in the application
    finalArgs[2] = fileHash
  }

  console.log('finalArgs', finalArgs)

  yield call(sendTransactionSaga, registry, methodName, finalArgs)
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
    // console.log('receipt', receipt)
    yield put(txnMining(receipt))

    const minedTxn = yield provider.waitForTransaction(receipt.hash).then(txn => txn)

    yield put(txnMined(minedTxn))
    yield call(delay, 3000)
    yield put(clearTxn(minedTxn))
    yield put(updateBalancesRequest())
  } catch (error) {
    if (error.toString().includes('MetaMask Tx Signature: User denied transaction signature')) {
      console.log('MetaMask tx denied')
      return false
    }
    console.log('error', error)
  }
}
