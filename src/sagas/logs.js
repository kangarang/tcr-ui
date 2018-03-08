import { select, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import EthAbi from 'ethjs-abi'
import Eth from 'ethjs'

import ipfsAPI from 'ipfs-api'

import { newArray, pollLogsRequest, updateBalancesRequest } from '../actions'

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from '../actions/constants'

import log from '../utils/_log'
import _abi from '../utils/_abi'
import { baseToConvertedUnit } from '../utils/_unit'

import {
  selectEthjs,
  selectNetworkID,
  selectRegistry,
  selectVoting,
  selectAllListings,
} from '../selectors'

import { convertUnixTimeLeft, dateHasPassed } from '../utils/_datetime'
import { fromJS } from 'immutable'

let lastReadBlockNumber = 0

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
  yield takeLatest(POLL_LOGS_REQUEST, pollLogsSaga)
}

function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
    const listings = yield call(
      handleLogs,
      lastReadBlockNumber,
      'latest',
      '',
      registry.contract
    )

    const newListings = yield call(updateListings, [], listings)

    if (newListings.size > 0) {
      yield put(newArray(newListings))
      yield put(updateBalancesRequest())
    }
  } catch (err) {
    console.log('Fresh log error:', err)
    throw new Error(err.message)
    // yield put(logsError('logs error', err))
  }

  yield fork(pollController)
}
function* pollController() {
  const network = yield select(selectNetworkID)
  let pollInterval = 5000 // 5 seconds

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

function updateListings(listings, newListings) {
  const latestListings = fromJS(newListings).reduce((acc, val) => {
    const index = acc.findIndex(
      it => it.get('listingHash') === val.get('listingHash')
    )
    // New listing
    if (index === -1) {
      return acc.push(val)
    }
    // Check to see if the event is the more recent
    if (val.getIn(['latest', 'ts']) > acc.getIn([index, 'latest', 'ts'])) {
      return acc.setIn([index, 'latest'], fromJS(val.get('latest')))
    }
    // Not unique, not more recent, return List
    return acc
  }, fromJS(listings))
  return latestListings
}

function* pollLogsSaga(action) {
  try {
    const ethjs = yield select(selectEthjs)
    const registry = yield select(selectRegistry)
    const allListings = yield select(selectAllListings)
    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)
    const newListings = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBock,
      '',
      registry.contract
    )
    if (newListings.length === 0) {
      return
    }
    console.log('allListings', allListings)
    const latestListings = yield call(updateListings, allListings, newListings)
    // TODO: semantics: setListings
    yield put(newArray(latestListings))
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('Poll logs error:', err)
    // yield put(logsError('logs error', err))
  }
}

// TODO: tests
function* handleLogs(sb, eb, topic, contract) {
  try {
    const ethjs = yield select(selectEthjs)
    const voting = yield select(selectVoting)
    const blockRange = yield {
      fromBlock: new Eth.BN(sb),
      toBlock: eb,
    }
    const filter = yield call(
      _abi.getFilter,
      contract.address,
      topic,
      [],
      contract.abi,
      blockRange
    )

    const rawLogs = yield call(ethjs.getLogs, filter)
    if (rawLogs.length === 0) {
      return []
    }
    const decoder = yield call(EthAbi.logDecoder, contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)
    console.log('decodedLogs', decodedLogs)
    const listings = (yield call(
      buildListings,
      decodedLogs,
      ethjs,
      rawLogs,
      contract,
      voting
    )).filter(lawg => !(lawg === false))
    return listings
  } catch (err) {
    console.log('Handle logs error:', err)
    // yield put(logsError('logs error', err))
  }
}

// TODO: tests
export async function buildListings(
  decodedLogs,
  ethjs,
  rawLogs,
  contract,
  voting
) {
  return Promise.all(
    decodedLogs.map(async (dLog, ind) => {
      const block = await log.getBlock(ethjs, rawLogs[ind].blockHash)
      const txDetails = await log.getTransaction(
        ethjs,
        rawLogs[ind].transactionHash
      )
      return buildListing(
        contract,
        block.timestamp,
        dLog,
        ind,
        txDetails,
        voting,
        decodedLogs
      )
    })
  )
}

async function buildListing(contract, ts, dLog, i, txn, voting, decodedLogs) {
  try {
    let { listingHash, challengeID, data } = dLog
    const event = dLog._eventName
    let numTokens
    let whitelisted
    let url

    if (event === '_ApplicationRemoved' || event === '_ListingRemoved') {
      whitelisted = false
      numTokens = 0
    }

    if (event === '_RewardClaimed') {
      // pull from the old logs to find the listingHash
      const dListing = decodedLogs.filter(
        li => li.pollID && li.pollID.toString() === challengeID.toString()
      )[0]
      if (!dListing) {
        return false
      }
      listingHash = dListing.listingHash
      numTokens = dListing.deposit && dListing.deposit.toString()
    }

    if (event === '_Application') {
      const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
      const ipfs = await ipfsAPI(config)
      const fileThing = await ipfs.files.get(data)
      let content
      fileThing.forEach(file => {
        console.log(file.path)
        content = file.content.toString('utf8')
      })
      content = JSON.parse(content)
      data = content.name
      url = content.url
      console.log(content)
    }

    let listing = await contract.listings.call(listingHash)
    numTokens = listing[3]
      ? baseToConvertedUnit(listing[3], 18).toString()
      : false

    if (listing) {
      whitelisted = listing[1]
    }

    let commitEndDate
    let commitExpiry
    let revealEndDate
    let revealExpiry

    let aeUnix = listing[0].toNumber()
    const appExpiry = convertUnixTimeLeft(aeUnix)
    const appExpired = dateHasPassed(aeUnix)

    let pollID = dLog.pollID || dLog.challengeID

    if (pollID) {
      pollID = pollID.toString()
      const poll = await voting.contract.pollMap(pollID)
      commitEndDate = poll[0].toNumber()
      commitExpiry = convertUnixTimeLeft(commitEndDate)
      revealEndDate = poll[1].toNumber()
      revealExpiry = convertUnixTimeLeft(revealEndDate)
    }
    const infoObject = {
      data,
      url,
      owner: event === '_Application' && txn.from,
      numTokens,
      pollID,
      sender: txn.from,
      ts: ts.toString(10),
    }
    return {
      data,
      url,
      owner: event === '_Application' && txn.from,
      listingHash,
      whitelisted,
      appExpiry,
      appExpired,

      latest: {
        txHash: txn.hash,
        blockHash: txn.blockHash,
        blockNumber: txn.blockNumber.toNumber(10),
        numTokens,
        pollID,
        sender: txn.from,
        event,
        ts,
        commitEndDate,
        commitExpiry,
        revealEndDate,
        revealExpiry,
      },
      infoObject,
    }
  } catch (err) {
    console.log('build listing error', err)
  }
}
