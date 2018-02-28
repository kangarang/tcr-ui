import { all, select, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import EthAbi from 'ethjs-abi'
import Eth from 'ethjs'
// import { Organization } from '@governx/governx-lib'

import { newArray, updateItems, pollLogsRequest, updateBalancesRequest } from '../actions'

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from '../actions/constants'

import log_utils from '../utils/log_utils'
import abi_utils from '../utils/abi_utils'
import { toUnitAmount } from '../utils/units_utils'

import { selectEthjs, selectNetworkID, selectRegistry, selectVoting, selectAccount } from '../selectors'

import { convertUnixTimeLeft, dateHasPassed } from '../utils/format-date';

export default function* logsSaga() {
  // yield takeLatest(SET_CONTRACTS, getFreshLogs)
  // yield takeLatest(SET_CONTRACTS, governX)
  // yield takeLatest(POLL_LOGS_REQUEST, pollLogsSaga)
}

// function* governX() {
//   const from = yield select(selectAccount)

//   const { poll, tcr, account } = new Organization({
//     address: '0x2e9321fc399202ea887e69497c5a00df2a47b358',
//     from,
//     network: 'rinkeby',
//   });
//   console.log('poll, tcr, account', poll, tcr, account)
// }

let lastReadBlockNumber = 0

function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
    const applications = yield call(
      handleLogs,
      lastReadBlockNumber,
      'latest',
      '', // All events
      registry
    )

    yield put(newArray(applications))
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('Fresh log error:', err)
    throw new Error(err.message)
    // yield put(logsError('logs error', err))
  }

  // yield fork(pollController)
}

function* pollController() {
  const network = yield select(selectNetworkID)
  let pollInterval = 15000 // 15 seconds

  if (network === '420') {
    pollInterval = 2000
  }

  while (true) {
    try {
      yield call(delay, pollInterval)
      yield put(
        pollLogsRequest({
          startBlock: lastReadBlockNumber,
          endBlock: 'latest',
        })
      )
    } catch (err) {
      console.log('Polling Log Saga error', err)
      // yield put(logsError('polling logs error', err))
    }
  }
}

function* pollLogsSaga(action) {
  const ethjs = yield select(selectEthjs)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  try {
    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)
    const contract = registry
    const newLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock,
      '',
      contract
    )
    if (newLogs.length > 0) {
      console.log(newLogs.length, 'newLog', newLogs[0])
      yield put(updateItems(newLogs))
      yield put(updateBalancesRequest())
    }
  } catch (err) {
    console.log('Poll logs error:', err)
    // yield put(logsError('logs error', err))
  }
}

function* handleLogs(sb, eb, topic, contract) {
  const voting = yield select(selectVoting)
  try {
    const ethjs = yield select(selectEthjs)

    const blockRange = {
      fromBlock: new Eth.BN(sb),
      toBlock: eb,
    }
    const filter = yield call(
      abi_utils.getFilter,
      contract.address,
      topic,
      [],
      contract.contract.abi,
      blockRange
    )

    const rawLogs = yield call(ethjs.getLogs, filter)
    const decoder = yield call(EthAbi.logDecoder, contract.contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)

    if (decodedLogs.length) {
      // console.log('decodedLogs', decodedLogs)
    }

    return yield all(
      (yield decodedLogs.map(async (dLog, ind) => {
        const block = await log_utils.getBlock(ethjs, rawLogs[ind].blockHash)
        const txDetails = await log_utils.getTransaction(
          ethjs,
          rawLogs[ind].transactionHash
        )
        return buildListing(contract, block, dLog, ind, txDetails, voting)
      })).filter(lawg => lawg !== false)
    )
  } catch (err) {
    console.log('Handle logs error:', err)
    // yield put(logsError('logs error', err))
  }
}

async function buildListing(contract, block, dLog, i, txDetails, voting) {
  try {
    if (!dLog.listingHash) {
      return false
    }

    // Get the listing struct from the mapping
    const listing = await contract.contract.listings.call(dLog.listingHash)

    if (!listing || listing[2] === '0x0000000000000000000000000000000000000000') {
      return false
    }

    let commitEndDate
    let commitExpiry
    let revealEndDate
    let revealExpiry

    if (dLog._eventName === '_Challenge' || dLog._eventName === '_VoteCommitted') {
      const poll = await voting.contract.pollMap(dLog.pollID.toString())
      commitEndDate = poll[0].toNumber()
      commitExpiry = convertUnixTimeLeft(commitEndDate)
      revealEndDate = poll[1].toNumber()
      revealExpiry = convertUnixTimeLeft(revealEndDate)
    }

    const aeUnix = listing[0].toNumber()
    const appExpiry = convertUnixTimeLeft(aeUnix)
    const appExpired = dateHasPassed(aeUnix)

    if (appExpired) {
      // expired
      // can call updateStatus()
      // 
    }

    const isWhitelisted = listing[1]

    const tx = {
      hash: txDetails.hash,
      from: txDetails.from,
      to: txDetails.to,
      index: txDetails.transactionIndex,
      timestamp: new Date(block.timestamp * 1000).toUTCString(),
    }

    const details = {
      listingString: dLog.data,
      listingHash: dLog.listingHash,
      unstakedDeposit: listing[3] ? toUnitAmount(listing[3], 18) : false,
      pollID: dLog.pollID ? dLog.pollID.toString(10) : false,
      index: i,
      eventName: dLog._eventName,
      isWhitelisted,
      blockHash: txDetails.blockHash,
      blockNumber: txDetails.blockNumber && txDetails.blockNumber.toNumber(10),
      appExpiry,
      appExpired,
      commitEndDate,
      commitExpiry,
      revealEndDate,
      revealExpiry,
    }

    const finalForm = log_utils.shapeShift(block, tx, details)
    console.log('listing (individual log):', finalForm)
    return finalForm
  } catch (err) {
    console.log('build listing error', err)
  }
}
