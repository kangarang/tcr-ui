import { select, put, call, fork, takeEvery } from 'redux-saga/effects'
import _ from 'lodash/fp'
import ethUtil from 'ethereumjs-util'

import * as actions from '../actions'
import * as types from '../types'
import * as epActions from 'modules/home/actions'

import { selectRegistry, selectVoting, selectToken } from 'modules/home/selectors'

import { getEthjs, getEthersProvider } from 'libs/provider'
import { ipfsAddObject } from 'libs/ipfs'
import { getListingHash } from 'libs/values'

import { commitVoteSaga, revealVoteSaga, requestVotingRightsSaga } from './voting'
import { pendingTxns } from '../../notifications'
import { delay } from 'redux-saga'
import { selectAccount } from '../../home/selectors'

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
        // console.log('is object')
        return rg.toString(10)
      } else if (_.isString(rg)) {
        // console.log('is string')
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
      case 'transfer':
        yield call(sendTransactionSaga, token, methodName, newArgs)
        break
      case 'personalSign':
        yield call(personalMessageSignatureRecovery)
        break
      case 'claimReward':
        yield call(sendTransactionSaga, registry, methodName, newArgs)
        break
      default:
        console.log('unknown methodname')
    }
  } catch (error) {
    console.log('send transaction error:', error)
  }
}

async function ethPersonalSign(ethjs, account) {
  const data = 'Sign personal message'
  const message = ethUtil.toBuffer(data)
  const msg = ethUtil.bufferToHex(message)
  return ethjs.personal_sign(msg, account)
}
async function ethPersonalRecovery(ethjs, serialized) {
  // same data
  const data = 'Sign personal message'
  const message = ethUtil.toBuffer(data)
  const msg = ethUtil.bufferToHex(message)
  return ethjs.personal_ecRecover(msg, serialized)
}

function* personalMessageSignatureRecovery() {
  const ethjs = yield call(getEthjs)
  const account = yield select(selectAccount)

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  // this triggers metamask popup and waits for user to press 'sign'
  // account must be the one signing the msg
  const signedAndSerialized = yield call(ethPersonalSign, ethjs, account)
  console.log('Signed and serialized!  Result is: ', signedAndSerialized)

  console.log('Recovering...')
  // under the hood, this unpacks the message and gets the address
  const recovered = yield call(ethPersonalRecovery, ethjs, signedAndSerialized)

  if (recovered === account) {
    console.log('Ethjs recovered the message signer!', recovered)
  } else {
    console.log('Ethjs failed to recover the message signer!')
    console.dir({ recovered })
  }
}

export function* registryTxnSaga(action) {
  try {
    const registry = yield select(selectRegistry)
    const { methodName, args } = action.payload

    if (methodName === 'apply') {
      const fileHash = yield call(ipfsAddObject, {
        id: args[0], // listing string (name)
        data: args[2], // data (address)
      })
      // hash the string
      const listingHash = yield call(getListingHash, args[0])
      // use ipfs CID as the _data field in the application
      const dataString = fileHash
      const finalArgs = [listingHash, args[1], dataString]
      yield call(sendTransactionSaga, registry, methodName, finalArgs)
    } else {
      yield call(sendTransactionSaga, registry, methodName, args)
    }
  } catch (error) {
    console.log('registryTxn error', error)
  }
}

export function* sendTransactionSaga(contract, method, args) {
  try {
    console.log(method, 'args:', args)

    // ethjs: sendTransaction
    const txHash = yield call(contract[method], ...args)
    yield put(actions.txnMining(txHash))

    // pending tx notification
    yield fork(pendingTxns, method, txHash, args)

    // ethers: waitForTransaction
    const ethersProvider = yield call(getEthersProvider)
    const minedTxn = yield ethersProvider.waitForTransaction(txHash)
    console.log('minedTxn:', minedTxn)

    // BUG: sometimes, ethjs doesn't pick up the transaction in time. racing?
    // maybe try: const minedTxn = yield call(ethersProvider.waitForTransaction, txHash)
    yield call(delay, 2000)

    // get tx receipt
    const ethjs = yield call(getEthjs)
    const txReceipt = yield call(ethjs.getTransactionReceipt, minedTxn.hash)
    console.log('txReceipt:', txReceipt)

    // dispatch on success
    if (txReceipt.status === '0x01' || txReceipt.status === '0x1') {
      yield put(actions.sendTransactionSucceeded(txReceipt))
      yield put(epActions.updateBalancesStart())
      // if you decide to re-implement this, you need to control *which* txn
      // you are attempting to clear (in reducer)
      // yield call(delay, 5000)
      // yield put(actions.clearTxn(txReceipt))
    } else {
      throw new Error(JSON.stringify(txReceipt))
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
