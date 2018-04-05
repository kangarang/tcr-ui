import { select, put, call, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import _ from 'lodash/fp'

import { SEND_TRANSACTION, txnMining, txnMined, clearTxn } from '../actions/transaction'

import { selectProvider, selectRegistry, selectVoting, selectToken } from '../selectors'
import { ipfsAddData } from '../libs/ipfs'

import { getListingHash } from '../libs/values'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './vote'
import { updateBalancesRequest } from '../actions/home'

export default function* transactionSaga() {
  yield takeEvery(SEND_TRANSACTION, handleSendTransaction)
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

export function* registryTxnSaga(action) {
  try {
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
      // const isSuccess = flow(get('status'), isEqual(200))
      // isSuccess(fileHash)
      // hash the string
      finalArgs[0] = getListingHash(args[0])
      // use ipfs CID as the _data field in the application
      finalArgs[2] = fileHash
    }

    console.log('finalArgs', finalArgs)

    yield call(sendTransactionSaga, registry, methodName, finalArgs)
  } catch (error) {
    console.log('registryTxn error', error)
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

    const defaults = {
      gas: 4700000,
      gasPrice: 20000000000,
    }
    const receipt = yield contract.functions[method](...newArgs)
    yield put(txnMining(receipt))
    const minedTxn = yield provider.waitForTransaction(receipt.hash).then(txn => txn)
    yield put(txnMined(minedTxn))
    yield put(updateBalancesRequest())

    yield call(delay, 5000)
    yield put(clearTxn(minedTxn))
  } catch (error) {
    if (error.toString().includes('MetaMask Tx Signature: User denied transaction signature')) {
      console.log('MetaMask tx denied')
      return false
    }
    console.log('error', error)
  }
}
