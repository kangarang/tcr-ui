import { SET_CONTRACTS } from "../actions/constants";

import { all, takeLatest, call, put, select } from 'redux-saga/effects'

import {
  setDecodedLogs,
  newArray,
  logsError,
  updateItems,
} from '../actions'

import { getContract, getRegistry } from '../contracts/index';

import {
  logUtils,
  commonUtils,
} from './utils'
import { tokensAllowedSaga } from "./token";

import {
  fromNaturalUnit,
} from '../libs/units'
import { getEthjs } from "../libs/provider";

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
}

// Gets fresh logs
function* getFreshLogs(action) {
  const registry = action.payload.registry
  try {
    const [
      applications,
      challenges,
    ] = yield all([
      call(handleLogs, '_Application'),
      call(handleLogs, '_Challenge'),
    ])
    console.log('applications', applications)
    console.log('challenges', challenges)

    yield put(newArray(applications))
    yield put(updateItems(challenges))
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
  yield call(tokensAllowedSaga, registry.address)
}


function* handleLogs(topic) {
  const eth = yield call(getEthjs)
  const registry = yield call(getRegistry)

  const filter = yield call(logUtils.buildFilter, registry.address, topic)
  const rawLogs = yield call(eth.getLogs, filter)
  const decodedLogs = yield call(logUtils.decodeLogs, eth, registry.contract, rawLogs)

  // if (topic !== '_Application') {
  //   return decodedLogs
  // }

  const builtLogs = yield all(
    yield decodedLogs.map(async (dLog, ind) => {
      const block = await commonUtils.getBlock(eth, rawLogs[ind].blockHash)
      const txDetails = await commonUtils.getTransaction(eth, rawLogs[ind].transactionHash)

      return call(buildListing, rawLogs, registry, block, dLog, ind, txDetails)
    })
  )
  return builtLogs
}

function* buildListing(rawLogs, registry, block, log, i, txDetails) {
  let unstakedDeposit = '0'
  if (log.deposit) {
    unstakedDeposit = fromNaturalUnit(log.deposit).toString(10)
  }

  const isWhitelisted = (yield call([registry.contract, 'isWhitelisted'], log.domain))['0']
  const canBeWhitelisted = (yield call([registry.contract, 'canBeWhitelisted'], log.domain))['0']

  const tx = {
    hash: rawLogs[i].transactionHash,
    from: txDetails.from,
    to: txDetails.to,
    index: txDetails.transactionIndex,
  }
  const details = {
    domain: log.domain,
    unstakedDeposit,
    pollID: log.pollID && log.pollID.toString(10),
    index: i,
    eventName: log._eventName,
    contractAddress: rawLogs[i].address,
    isWhitelisted,
    canBeWhitelisted,
  }

  return commonUtils.shapeShift(block, tx, details)
}