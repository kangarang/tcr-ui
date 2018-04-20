import { select, put, call, takeEvery } from 'redux-saga/effects'
import _ from 'lodash/fp'

import * as actions from '../actions'
import * as types from '../types'
import * as epActions from 'state/ducks/ethProvider/actions'

import { selectRegistry, selectVoting, selectToken } from 'state/ducks/home/selectors'

import { getEthjs, getEthersProvider } from 'state/libs/provider'
import { ipfsAddObject } from 'state/libs/ipfs'
import { getListingHash } from 'state/libs/values'

import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './voting'

export default function* transactionSaga() {
  yield takeEvery(types.SEND_TRANSACTION_START, handleSendTransaction)
}

export function* handleSendTransaction(action) {
  try {
    const { methodName, args } = action.payload
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)
    const registry = yield select(selectRegistry)

    // convert Objects (BNs) -> String
    const newArgs = args.map(rg => {
      if (_.isObject(rg)) {
        return rg.toString(10)
      } else if (_.isString(rg)) {
        return rg
      }
      // TODO: more typechecking
      return rg
    })

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
        yield call(sendTransactionSaga, token, methodName, newArgs)
        break
      case 'rescueTokens':
        yield call(sendTransactionSaga, voting, methodName, newArgs)
        break
      case 'claimVoteReward':
        yield call(sendTransactionSaga, registry, methodName, newArgs)
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
    const { methodName, args } = action.payload

    let finalArgs = _.clone(args)
    if (methodName === 'apply') {
      const fileHash = yield call(ipfsAddObject, {
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
  } catch (error) {
    console.log('registryTxn error', error)
  }
}

// TODO: minimize # of dependencies
export function* sendTransactionSaga(contract, method, args) {
  try {
    console.log(method, 'args:', args)
    // ethjs-contract: sendTransaction
    const txHash = yield call(contract[method], ...args)
    yield put(actions.txnMining(txHash))

    // ethers: waitForTransaction
    const ethersProvider = yield call(getEthersProvider)
    const minedTxn = yield ethersProvider.waitForTransaction(txHash).then(txn => txn)
    console.log('minedTxn:', minedTxn)

    // ethjs: getTransactionReceipt
    const ethjs = yield call(getEthjs)
    const txReceipt = yield call(ethjs.getTransactionReceipt, minedTxn.hash)
    console.log('txReceipt:', txReceipt)

    // successful sendTransaction
    if (txReceipt.status === '0x01' || txReceipt.status === '0x1') {
      const txLogs = txReceipt.logs
      console.log('txLogs:', txLogs)
      // dispatch tx receipt, update balances
      yield put(actions.sendTransactionSucceeded(txReceipt))
      yield put(epActions.updateBalancesStart())
      // if you decide to re-implement this, you need to control *which* txn
      // you are attempting to clear (in reducer)
      // yield call(delay, 5000)
      // yield put(actions.clearTxn(txReceipt))
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error) {
    // MetaMask `reject`
    if (
      error
        .toString()
        .includes('MetaMask Tx Signature: User denied transaction signature')
    ) {
      console.log('MetaMask tx denied')
      return false
    }
    yield put(actions.sendTransactionFailed({ error }))
  }
}
