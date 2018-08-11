import { all, takeEvery, call, put } from 'redux-saga/effects'
import EthEvents from 'eth-events'

import { getEthjs } from 'libs/provider'

import { decodeLogsFailed, decodeLogsSucceeded } from '../actions'
import { DECODE_LOGS_START } from '../types'
import { notificationsSaga } from './notifications'

// receives specs about what type of logs to decode
// forwards to the decoder
export default function* rootDecodeLogsSaga() {
  yield takeEvery(DECODE_LOGS_START, decodeLogsSaga)
}

// returns decoded logs via action.decodeLogsSucceeded
export function* decodeLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    const {
      blockRange: { fromBlock, toBlock },
      contract: { abi, address },
      eventNames,
      indexedFilterValues,
    } = action.payload

    // init eth-events
    const ethEvents = yield new EthEvents(ethjs, { abi, address })

    // get payload logs
    const lawgs = yield call(
      ethEvents.getLogs,
      fromBlock,
      toBlock,
      eventNames,
      indexedFilterValues
    )
    console.log(lawgs.length, eventNames, 'logs:', lawgs)

    // dispatch normalized logs
    yield put(decodeLogsSucceeded(lawgs))

    // notifications
    if (lawgs.length < 3) {
      yield all(lawgs.map(lawg => notificationsSaga(lawg)))
    }
  } catch (err) {
    yield put(decodeLogsFailed(err))
  }
}
