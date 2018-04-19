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

import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './voting'
import { registryTxnSaga } from './registry'

export default function* transactionSaga() {
  yield takeEvery(types.SEND_TRANSACTION_START, handleSendTransaction)
}

// TODO: write tests for these sagas. against abis
export function* handleSendTransaction(action) {
  try {
    const { methodName, args } = action.payload
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)
    const registry = yield select(selectRegistry)

    // convert BN objects -> String
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

export function* sendTransactionSaga(contract, method, args) {
  try {
    // invoke contract function
    const txHash = yield contract[method](...args)
    yield put(actions.txnMining(txHash))

    // wait 2 seconds, then get txn receipt
    yield call(delay, 2000)
    const ethjs = yield call(getEthjs)
    const txReceipt = yield call(ethjs.getTransactionReceipt, txHash)
    console.log('txReceipt:', txReceipt)

    // TODO: figure out a better way to get the status
    // const filter = yield registry._Application().new({ toBlock: 'latest' })
    // console.log('filter:', filter)
    const account = yield select(selectAccount)

    // successful transaction
    if (txReceipt.status === '0x01') {
      const txLogs = txReceipt.logs
      console.log('txLogs:', txLogs)
      const indexedFilterValues = yield {
        listingHash: args[0],
        applicant: account,
      }
      const filter = yield call(
        _abi.getFilter,
        contract.address,
        '_Application',
        indexedFilterValues,
        contract.abi,
        { fromBlock: '0', toBlock: 'latest' }
      )
      console.log('filter:', filter)

      // const eventSignature = utils.id('_Application(bytes32,uint256,uint256,string,address)')
      // console.log('eventSignature:', eventSignature)
      // 0xa27f550c3c7a7c6d8369e5383fdc7a3b4850d8ce9e20066f9d496f6989f00864

      yield put(actions.sendTransactionSucceeded(txReceipt))
      yield put(homeActions.updateBalancesStart())
      yield call(delay, 5000)
      yield put(actions.clearTxn(txReceipt))
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error) {
    // MetaMask `reject`
    if (error.toString().includes('MetaMask Tx Signature: User denied transaction signature')) {
      console.log('MetaMask tx denied')
      return false
    }
    yield put(actions.sendTransactionFailed({ error }))
  }
}
