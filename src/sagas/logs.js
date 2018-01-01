import { takeLatest, call, put, select } from 'redux-saga/effects'

import { setDecodedLogs, logsError } from '../actions'
import { SET_CONTRACTS } from '../constants'
import { selectEthjs, selectRegistry } from '../selectors'
import { buildAndDecodeLogs, shapeShift } from './log-utils'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
}

// Gets fresh logs
function* getFreshLogs() {
  const registry = yield select(selectRegistry)
  const eth = yield select(selectEthjs)
  try {
    // const allEvents = yield call(shapeShift, eth, registry, '_Application')
    // const allEvents = yield call(buildAndDecodeLogs, eth, registry)
    const applications = yield call(buildAndDecodeLogs, eth, registry, '_Application')

    // const apps = allEvents.filter(app => !app.challengeID && !app.whitelisted)
    // const whitelist = applications.filter(app => app.whitelisted)
    // const challenged = allEvents.filter(app => app.challengeID)
    // console.log('allEvents', allEvents)
    console.log('applications', applications)

    // const canBeWhitelistedLogs = yield call(
    //   registry.filterDomainAndCall,
    //   applications,
    //   'canBeWhitelisted'
    // )

    yield put(setDecodedLogs(applications))
    // yield put(setDecodedLogs(allEvents))
    // yield put(setDecodedLogs(whitelist))
    // yield put()
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}
