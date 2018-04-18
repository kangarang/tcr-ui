import { select, put, call, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import _ from 'lodash/fp'

import { ipfsAddData } from '../libs/ipfs'
import { getListingHash } from '../libs/values'

import { updateBalancesRequest } from '../home/actions'

import actions from './actions'
import types from './types'
import { selectProvider, selectRegistry, selectVoting, selectToken } from 'state/home/selectors'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './sagas'

export default function* transactionSaga() {
  yield takeEvery(types.SEND_TRANSACTION, handleSendTransaction)
}

// TODO: write tests for these sagas. against abis
export function* handleSendTransaction(action) {
  try {
    const { methodName, args } = action.payload
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)
    const registry = yield select(selectRegistry)

    switch (methodName) {
      case 'apply':
      case 'challenge':
      case 'updateStatus':
        yield call(registryTxnSaga, action)
        break
      case 'requestVotingRights':
        yield call(requestVotingRightsSaga, action)
        break
      case 'commitVote':
        yield call(commitVoteSaga, action)
        break
      case 'revealVote':
        yield call(revealVoteSaga, action)
        break
      case 'approve':
        yield call(sendTransactionSaga, token, methodName, args)
        break
      case 'rescueTokens':
        yield call(sendTransactionSaga, voting, methodName, args)
        break
      case 'claimVoteReward':
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      default:
        console.log('unknown methodname')
    }
  } catch (error) {
    console.log('send transaction error:', error)
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

    // const defaults = {
    //   gas: 4700000,
    //   gasPrice: 20000000000,
    // }
    const receipt = yield contract.functions[method](...newArgs)
    yield put(actions.txnMining(receipt))

    const minedTxn = yield provider.waitForTransaction(receipt.hash).then(txn => txn)
    yield put(actions.txnMined(minedTxn))

    yield put(updateBalancesRequest())

    yield call(delay, 5000)
    yield put(actions.clearTxn(minedTxn))
  } catch (error) {
    if (error.toString().includes('MetaMask Tx Signature: User denied transaction signature')) {
      console.log('MetaMask tx denied')
      return false
    }
    console.log('error', error)
  }
}
