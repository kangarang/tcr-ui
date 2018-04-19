import { select, put, call, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import _ from 'lodash/fp'
// import utils from 'ethers/utils'

import homeActions from 'state/ducks/home/actions'
import {
  selectRegistry,
  selectVoting,
  selectToken,
  selectAccount,
} from 'state/ducks/home/selectors'

import { getEthjs } from 'state/libs/provider'
import _abi from 'state/utils/_abi'

import actions from '../actions'
import types from '../types'

import { getEthersProvider } from 'state/libs/provider'
import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './voting'
import { registryTxnSaga } from './registry'

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

// TODO: minimize # of dependencies
export function* sendTransactionSaga(contract, method, args) {
  try {
    // ethjs-contract: sendTransaction
    const txHash = yield contract[method](...args)
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
    if (txReceipt.status === '0x01') {
      const txLogs = txReceipt.logs
      console.log('txLogs:', txLogs)
      // dispatch tx receipt, update balances
      yield put(actions.sendTransactionSucceeded(txReceipt))
      yield put(homeActions.updateBalancesStart())
      // if you decide to re-implement this, you need to control *which* txn
      // you are attempting to clear (in reducer)
      // yield call(delay, 5000)
      // yield put(actions.clearTxn(txReceipt))
    } else {
      throw new Error('Transaction failed')
    }
    // this is practice
    // const account = yield select(selectAccount)
    // const indexedFilterValues = yield {
    //   listingHash: args[0],
    //   applicant: account,
    // }
    // const filter = yield call(
    //   _abi.getFilter,
    //   contract.address,
    //   '_Application',
    //   indexedFilterValues,
    //   contract.abi,
    //   { fromBlock: '0', toBlock: 'latest' }
    // )
    // console.log('filter:', filter)
  } catch (error) {
    // MetaMask `reject`
    if (error.toString().includes('MetaMask Tx Signature: User denied transaction signature')) {
      console.log('MetaMask tx denied')
      return false
    }
    yield put(actions.sendTransactionFailed({ error }))
  }
}
