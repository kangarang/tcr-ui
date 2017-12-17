import { takeLatest, call, put, select } from 'redux-saga/effects'

import { setDecodedLogs, logsError } from '../actions'
import { SET_CONTRACTS } from '../constants'
import { selectEthjs, selectRegistry } from '../selectors'
import { buildAndDecodeLogs } from './log-utils'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
}

// Gets fresh logs
function* getFreshLogs() {
  const registry = yield select(selectRegistry)
  const eth = yield select(selectEthjs)
  try {
    const logs = yield call(buildAndDecodeLogs, eth, registry, '_Application')
    // const challenged = logs.filter(log => log.challengeID)
    // console.log('challenged', challenged)

    const canBeWhitelistedLogs = yield call(
      registry.filterDomainAndCall,
      logs,
      'canBeWhitelisted'
    )
    console.log('canBeWhitelistedLogs', canBeWhitelistedLogs)

    yield put(setDecodedLogs(logs))
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}
