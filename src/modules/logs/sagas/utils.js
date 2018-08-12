import { take, put } from 'redux-saga/effects'
import sortBy from 'lodash/fp/sortBy'

import * as actions from '../actions'
import * as types from '../types'

export function* getSortedLogsSaga(
  blockRange = { fromBlock: '0', toBlock: 'latest' },
  eventNames = [],
  contract
) {
  const payload = {
    blockRange,
    eventNames,
    contract: {
      abi: contract.abi,
      address: contract.address,
    },
  }

  // decode logs
  yield put(actions.decodeLogsStart(payload))
  // wait for success
  const decodedLogs = yield take(types.DECODE_LOGS_SUCCEEDED)
  // sort by block.timestamp
  return sortBy([l => l.txData.blockTimestamp], decodedLogs.payload)
}
