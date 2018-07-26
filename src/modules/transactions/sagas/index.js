import { select, put, call, takeEvery } from 'redux-saga/effects'
import EthAbi from 'ethjs-abi'

import * as actions from '../actions'
import * as types from '../types'
import * as epActions from 'modules/home/actions'

import {
  selectAccount,
  selectNetwork,
  selectRegistry,
  selectVoting,
  selectToken,
  selectTCR,
  selectParameters,
} from 'modules/home/selectors'
import { selectSidePanelListing } from 'modules/listings/selectors'

import { getGasPrice } from 'api/gas'
// import { ipfsAddObject } from 'libs/ipfs'
import { convertedToBaseUnit } from 'libs/units'
import { getListingHash } from 'libs/values'
import { getEthjs, getEthersProvider } from 'libs/provider'

import { commitVoteSaga } from './voting'
// import { pendingTxns } from '../../notifications'
import { delay } from 'redux-saga'
import logUtils from 'modules/logs/sagas/utils'

export default function* transactionSaga() {
  yield takeEvery(types.SEND_TRANSACTION_START, sendTxStartSaga)
}

function* sendTxStartSaga(action) {
  try {
    const tcr = yield select(selectTCR)
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)
    const registry = yield select(selectRegistry)
    const parameters = yield select(selectParameters)
    const listing = yield select(selectSidePanelListing)

    let {
      methodName,
      txInput: { numTokens, data, listingID, pollID, transferTo, voteOption, salt },
    } = action.payload

    let args = []
    let convertedNumTokens
    if (numTokens === '') {
      convertedNumTokens = yield call(
        convertedToBaseUnit,
        parameters.get('minDeposit'),
        tcr.get('tokenDecimals')
      )
    } else if (numTokens) {
      convertedNumTokens = yield call(
        convertedToBaseUnit,
        numTokens,
        tcr.get('tokenDecimals')
      )
    }

    switch (methodName) {
      case 'approveRegistry':
        args = [registry.address, convertedNumTokens]
        yield call(sendTransactionSaga, token, 'approve', args)
        break
      case 'approveVoting':
        args = [voting.address, convertedNumTokens]
        yield call(sendTransactionSaga, token, 'approve', args)
        break
      case 'transfer':
        args = [transferTo, convertedNumTokens]
        yield call(sendTransactionSaga, token, methodName, args)
        break
      case 'apply':
        // hash the string listingID
        const listingHash = yield call(getListingHash, listingID)
        args = [listingHash, convertedNumTokens, listingID, data]
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      case 'challenge':
        args = [listing.get('listingHash'), data]
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      case 'updateStatus':
        args = [listing.get('listingHash')]
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      case 'commitVote':
        yield call(
          commitVoteSaga,
          listing.get('pollID'),
          voteOption,
          salt,
          convertedNumTokens,
          listing.toJS()
        )
        break
      case 'revealVote':
        args = [pollID, voteOption, salt]
        yield call(sendTransactionSaga, voting, methodName, args)
        break
      case 'claimReward':
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      // case 'rescueTokens':
      //   yield call(sendTransactionSaga, voting, methodName, newArgs)
      //   break
      // case 'personalSign':
      //   yield call(personalMessageSignatureRecovery)
      //   break
      default:
        console.log('unknown methodname')
        break
    }
  } catch (error) {
    console.log('send transaction error:', error)
  }
}

export function* sendTransactionSaga(contract, method, args) {
  try {
    console.log(method, 'args:', args)
    const network = yield select(selectNetwork)
    const ethjs = yield call(getEthjs)
    const gasPrice = yield call(getGasPrice, network)
    const ethersProvider = yield call(getEthersProvider)

    // ethjs: sendTransaction
    const from = yield select(selectAccount)
    const nonce = yield call(ethjs.getTransactionCount, from)
    const methodAbi = yield call(logUtils.getMethodAbi, method, contract.abi)
    const data = EthAbi.encodeMethod(methodAbi, args)
    const payload = {
      to: contract.address,
      from,
      gasPrice,
      nonce,
      data,
    }
    const txHash = yield call(ethjs.sendTransaction, payload)
    yield put(actions.txnMining(txHash))

    // ethers: sendTransaction
    // const txHash = yield call(contract[method], ...args, { gasPrice })

    // pending tx notification
    // yield fork(pendingTxns, method, txHash, args)

    // TODO: pending tx saga handler -- instead of relying on ethersProvider, await the transaction via log polling
    // yield put(actions.sendTransactionPending(txHash))
    // const logAction = yield take(logTypes.POLL_LOGS_SUCCEEDED)
    // filter logs for the correct txHash
    // yield put(actions.sendTransactionSucceeded(log))

    // ethers: waitForTransaction
    const minedTxn = yield ethersProvider.waitForTransaction(txHash)
    console.log('minedTxn:', minedTxn)

    // sometimes ethjs doesnt catch it if it tries to quickly
    yield call(delay, 1000)

    // get tx receipt
    // const ethjs = yield call(getEthjs)
    const txReceipt = yield call(ethjs.getTransactionReceipt, minedTxn.hash)
    console.log('txReceipt:', txReceipt)

    // dispatch on success
    if (txReceipt.status === '0x01' || txReceipt.status === '0x1') {
      // if (minedTxn.hash !== '0x0') {
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
