import { all, call, put } from 'redux-saga/effects'
import EthAbi from 'ethjs-abi'

import { getEthjs } from 'libs/provider'
import { notificationsSaga } from './notifications'
import * as actions from '../actions'
import _utils from '../utils'

export function* decodeLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    // prettier-ignore
    const { blockRange, contract, eventNames, indexedFilterValues } = action.payload

    // prettier-ignore
    // get filter
    const filter = yield call(
      _utils.getFilter,
      blockRange, contract, eventNames, indexedFilterValues
    )

    // get raw encoded logs
    const rawLogs = yield call(ethjs.getLogs, filter)
    // exit if there's none
    if (rawLogs.length === 0) {
      yield put(actions.decodeLogsSucceeded([]))
      return
    }

    // decode logs
    const decoder = yield call(EthAbi.logDecoder, contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)

    // consolidate: logData, txData, eventName
    const lawgs = yield all(
      rawLogs.map(async (log, index) => {
        // transaction information
        const { block, tx } = await _utils.getBlockAndTxnFromLog(log, ethjs)
        const txData = {
          txHash: tx.hash,
          txIndex: tx.transactionIndex.toString(),
          logIndex: rawLogs[index].logIndex.toString(),
          blockNumber: block.number.toString(),
          blockTimestamp: block.timestamp.toNumber(),
        }
        // log information
        const logData = decodedLogs[index]
        return {
          logData,
          txData,
          eventName: logData._eventName,
        }
      })
    )

    // dispatch human-readable logs
    console.log(decodedLogs.length, eventNames, 'logs:', decodedLogs)
    yield put(actions.decodeLogsSucceeded(lawgs))

    // notifications
    if (lawgs.length < 3) {
      yield all(lawgs.map(lawg => notificationsSaga(lawg)))
    }
  } catch (err) {
    yield put(actions.decodeLogsFailed(err))
  }
}
