import { select, takeLatest, all, call, put } from 'redux-saga/effects'
import { fromJS } from 'immutable'
import _ from 'lodash'

import { setListings } from 'actions'
import {
  convertLogToGolem,
  sortByBlockTimestamp,
  findGolem,
  changeGolem,
  setApplications,
} from 'libs/listings'

import { selectProvider, selectRegistry, selectVoting, selectAllListings } from '../selectors'
import { SET_REGISTRY_CONTRACT, SET_CONTRACTS } from '../actions/constants'
import { sortByBlockNumber } from '../libs/listings'

export default function* rootLogsSaga() {
  yield takeLatest(SET_CONTRACTS, setupLogsSaga)
}

export function* setupLogsSaga() {
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  const {
    _Application,
    _Challenge,
    _ApplicationWhitelisted,
    _ApplicationRemoved,
    _ChallengeSucceeded,
  } = registry.interface.events

  const applications = yield call(getHistorySaga, _Application)

  const updatedApplications = yield call(setApplications, {}, applications)
  if (updatedApplications.size > 0) {
    yield put(setListings(updatedApplications))
  }

  const { _VoteCommitted, _VoteRevealed, _PollCreated } = voting.interface.events
  const otherEvents = [
    _Challenge,
    _ApplicationWhitelisted,
    _ApplicationRemoved,
    _ChallengeSucceeded,
    _VoteCommitted,
    _VoteRevealed,
    _PollCreated,
  ]
  const [
    cListings,
    awListings,
    arListings,
    csListings,
    vcListings,
    vrListings,
    pcListings,
  ] = yield all([
    call(getHistorySaga, _Challenge),
    call(getHistorySaga, _ApplicationWhitelisted),
    call(getHistorySaga, _ApplicationRemoved),
    call(getHistorySaga, _ChallengeSucceeded),
    call(getHistorySaga, _VoteCommitted),
    call(getHistorySaga, _VoteRevealed),
    call(getHistorySaga, _PollCreated),
  ])

  const arr = [
    ...cListings,
    ...awListings,
    ...arListings,
    ...csListings,
    ...vcListings,
    ...vrListings,
    ...pcListings,
  ]
  const flattened = _.flatten(arr)
  console.log('flattened', flattened)
  const sorted = sortByBlockTimestamp(flattened)
  console.log('sorted', sorted)

  const updatedListings = yield all(
    sorted.map(one => {
      console.log('one', one)
      const golem = one.get('golem')
      const eventName = one.get('eventName')
      const log = one.get('log')
      const txData = one.get('txData')
      const msgSender = one.get('msgSender')
      return changeGolem(golem, eventName, log, txData, msgSender)
    })
  )
  console.log('updatedListings', updatedListings)
  // if (updatedListings.size > 0) {
  //   yield put(setListings(updatedListings))
  // }
}

function* getHistorySaga(ContractEvent) {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)
  const allListings = yield select(selectAllListings)

  const decodedLogs = yield call(decodeLogs, provider, ContractEvent, registry.address)
  const listings = yield call(convertDecodedLogs, decodedLogs, ContractEvent, provider, allListings)
  // const golem2 = changeGolem(golem, ContractEvent.name, logData, txData, tx.from)
  // listings.push(golem2)
  // const sorted = sortByBlockTimestamp(flatListings)
  // console.log('sorted.toJS()', sorted)
  // const updatedListings = yield call(setApplications, allListings, sorted)
  // console.log('updated applications:', updatedListings.toJS())
  return listings
}

let lastReadBlockNumber = 0
// TODO: test
async function decodeLogs(provider, ContractEvent, address) {
  // build filter
  const filter = {
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address,
    topics: ContractEvent.topics,
  }
  // get logs according to filter
  const logs = await provider.getLogs(filter)
  return logs
}
// This is still building history
export async function convertDecodedLogs(logs, ContractEvent, provider, allListings) {
  let listings = []
  for (const log of logs) {
    // decode logs
    const logData = await decodeLog(ContractEvent, log)
    const { block, tx } = await getBlockAndTxnFromLog(log, provider)
    const txData = {
      txHash: tx.hash,
      blockNumber: block.number,
      blockHash: block.hash,
      ts: block.timestamp,
    }
    if (ContractEvent.name === '_Application') {
      // transform into a listing object
      const listing = await convertLogToGolem(logData, txData, tx.from)
      listings.push(listing)
    } else {
      const golem = await findGolem(logData.listingHash, allListings)
      listings.push({
        txData,
        log: logData,
        msgSender: tx.from,
        eventName: ContractEvent.name,
        golem,
      })
    }
  }
  console.log(ContractEvent.name, 'listings', listings)
  return listings
}

export async function decodeLog(ContractEvent, log) {
  return ContractEvent.parse(log.topics, log.data)
}

export async function getBlockAndTxnFromLog(log, provider) {
  // get block and txn
  const block = await provider.getBlock(log.blockHash)
  const tx = await provider.getTransaction(log.transactionHash)
  return { block, tx }
}
