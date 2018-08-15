import { select, put, call, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import EthAbi from 'ethjs-abi'

import * as homeActions from 'modules/home/actions'
import * as actions from '../actions'
import * as types from '../types'
import { selectTxPanelListing, selectApplicationForm } from '../selectors'

import {
  selectParameters,
  selectRegistry,
  selectAccount,
  selectNetwork,
  selectVoting,
  selectToken,
  selectTCR,
} from 'modules/home/selectors'

import { getIpfsABIsHash } from 'config'
import { getGasPrice } from 'api/gas'
import { getMethodAbi } from 'libs/abi'
import { ipfsAddObject } from 'libs/ipfs'
import { getListingHash } from 'libs/values'
import { toTokenBase } from 'libs/units'
import { getEthjs, getEthersProvider } from 'libs/provider'

import { commitVoteSaga } from './voting'
import { personalMessageSignatureRecovery } from './signedMsg'
import { selectAllListings } from '../../listings/selectors'

export default function* transactionSaga() {
  yield takeEvery(types.SEND_TRANSACTION_START, sendTxStartSaga)
}

function* sendTxStartSaga(action) {
  try {
    const tcr = yield select(selectTCR)
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)
    const network = yield select(selectNetwork)
    const registry = yield select(selectRegistry)
    const parameters = yield select(selectParameters)
    const listing = yield select(selectTxPanelListing)

    const {
      methodName,
      txInput: { numTokens, data, listingID, pollID, transferTo, voteOption, salt },
    } = action.payload

    // converts user input -> base units (add `decimals` 0's to the value)
    let convertedNumTokens
    if (numTokens === '') {
      convertedNumTokens = yield call(
        toTokenBase,
        parameters.get('minDeposit'),
        tcr.get('tokenDecimals')
      )
    } else if (numTokens) {
      convertedNumTokens = yield call(toTokenBase, numTokens, tcr.get('tokenDecimals'))
    }

    switch (methodName) {
      case 'approveRegistry': {
        const args = [registry.address, convertedNumTokens]
        yield call(sendTransactionSaga, token, 'approve', args)
        break
      }
      case 'approveVoting': {
        const args = [voting.address, convertedNumTokens]
        yield call(sendTransactionSaga, token, 'approve', args)
        break
      }
      case 'transfer': {
        const args = [transferTo, convertedNumTokens]
        yield call(sendTransactionSaga, token, methodName, args)
        break
      }
      case 'apply': {
        const appForm = yield select(selectApplicationForm)
        console.log('appForm:', appForm.toJS())
        const {
          values: { listingID, data },
        } = appForm.toJS()

        const listingHash = yield call(getListingHash, listingID)
        const allListings = yield select(selectAllListings)

        if (allListings.has(listingHash)) {
          throw new Error('listing already exists')
        }

        // NOTE: this follows the conventions supported by the forked kangarang/tcr contracts
        let args = [listingHash, convertedNumTokens, listingID, data]

        // check if the current multihash points to Prospect Park
        const ipfsAbiMultihash = yield call(getIpfsABIsHash, network)
        if (ipfsAbiMultihash === 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu') {
          // if so, add/pin a metadata object to ipfs
          const ipfsObject = { id: listingID, data }
          const listingMultihash = yield call(ipfsAddObject, ipfsObject)
          console.log('listingMultihash:', listingMultihash)
          // Prospect Park & ipfs-compatible args
          args = [listingHash, convertedNumTokens, listingMultihash]
        }
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      }
      case 'challenge': {
        const args = [listing.get('listingHash'), data]
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      }
      case 'updateStatus': {
        const args = [listing.get('listingHash')]
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      }
      case 'commitVote': {
        yield call(
          commitVoteSaga,
          listing.get('pollID'),
          voteOption,
          salt,
          convertedNumTokens,
          listing.toJS()
        )
        break
      }
      case 'revealVote': {
        const args = [pollID, voteOption, salt]
        yield call(sendTransactionSaga, voting, methodName, args)
        break
      }
      case 'claimReward': {
        const args = [pollID, voteOption, salt]
        yield call(sendTransactionSaga, registry, methodName, args)
        break
      }
      case 'rescueTokens': {
        const args = [pollID]
        yield call(sendTransactionSaga, voting, methodName, args)
        break
      }
      case 'personalSign': {
        yield call(personalMessageSignatureRecovery)
        break
      }
      default: {
        console.log('unknown methodName:', methodName)
        break
      }
    }
  } catch (error) {
    console.log('send transaction error:', error)
  }
}

export function* sendTransactionSaga(contract, method, args) {
  try {
    console.log(method, 'args:', args)
    const ethjs = yield call(getEthjs)
    const network = yield select(selectNetwork)
    const gasPrice = yield call(getGasPrice, network)
    const ethersProvider = yield call(getEthersProvider)

    // ethjs: sendTransaction
    const from = yield select(selectAccount)
    const nonce = yield call(ethjs.getTransactionCount, from)
    const methodAbi = yield call(getMethodAbi, method, contract.abi)
    const data = EthAbi.encodeMethod(methodAbi, args)
    const payload = { to: contract.address, from, gasPrice, nonce, data }
    const txHash = yield call(ethjs.sendTransaction, payload)

    // pending tx notification
    // yield put(actions.txnMining(txHash))
    // yield fork(pendingTxns, method, txHash, args)

    // wait for tx to get mined
    const minedTxn = yield ethersProvider.waitForTransaction(txHash)
    console.log('minedTxn:', minedTxn)

    // sometimes ethjs doesnt catch it if there's not enough time in between the function calls
    yield call(delay, 1500)

    // TODO: pending tx saga handler -- instead of relying on ethersProvider, await the transaction via log polling
    // yield put(actions.sendTransactionPending(txHash))
    // const logAction = yield take(logTypes.POLL_LOGS_SUCCEEDED)
    // filter logs for the correct txHash
    // yield put(actions.sendTransactionSucceeded(log))

    // get tx receipt
    const txReceipt = yield call(ethjs.getTransactionReceipt, minedTxn.hash)
    console.log('txReceipt:', txReceipt)

    // dispatch on success
    if (txReceipt.status === '0x01' || txReceipt.status === '0x1') {
      yield put(actions.sendTransactionSucceeded(txReceipt))
      yield put(homeActions.updateBalancesStart())
    } else {
      throw new Error(JSON.stringify(txReceipt))
    }
  } catch (error) {
    // MetaMask `reject`
    // prettier-ignore
    if (error.toString().includes('MetaMask Tx Signature: User denied transaction signature')) {
      console.log('MetaMask tx denied')
      return false
    }
    yield put(actions.sendTransactionFailed({ error }))
  }
}
