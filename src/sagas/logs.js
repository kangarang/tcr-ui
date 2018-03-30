import { select, takeLatest, all, call, put } from 'redux-saga/effects'
import _ from 'lodash'

import { setListings } from 'actions'
import { SET_CONTRACTS } from 'actions/constants'
import { convertLogToGolem, updateApplications } from 'libs/listings'

import { selectProvider, selectRegistry, selectVoting } from '../selectors'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, setupEventsSaga)
}

export function* setupEventsSaga() {
  const registry = yield select(selectRegistry)
  const { _Application } = registry.interface.events
  yield call(getHistorySaga, [_Application])
}

function* getHistorySaga(ContractEvents) {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)

  const freshApplications = yield all(
    ContractEvents.map(async ContractEvent => {
      return decodeLogs(provider, registry, ContractEvent, voting, registry.address)
    })
  )
  const flattenedApps = _.flatten(freshApplications)
  console.log('flattenedApps', flattenedApps)
  const updatedApplications = yield call(updateApplications, {}, flattenedApps)
  console.log('updatedApplications', updatedApplications.toJS())
  yield put(setListings(updatedApplications))
}

let lastReadBlockNumber = 1917000
async function decodeLogs(provider, registry, ContractEvent, voting, address) {
  // build filter
  const filter = {
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address,
    topics: ContractEvent.topics,
  }
  // get logs according to filter
  const logs = await provider.getLogs(filter)
  console.log(ContractEvent.name, logs)

  let listings = []
  for (const log of logs) {
    // decode logs
    const logData = await decodeLog(ContractEvent, log)
    const { block, tx } = await getBlockAndTxnFromLog(log, provider)

    // transform into a listing object
    const listing = await convertLogToGolem(
      logData,
      block,
      tx,
      ContractEvent.name,
      registry,
      voting
    )
    listings.push(listing)
  }
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
