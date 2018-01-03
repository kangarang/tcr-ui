import { all, takeLatest, call, put, select } from 'redux-saga/effects'
// import { fromJS } from 'immutable'

import { setDecodedLogs, logsError } from '../actions'
import { SET_CONTRACTS } from '../constants'
import { selectEthjs, selectRegistry } from '../selectors'

import {
  logUtils,
  commonUtils,
} from './utils'

import {
  fromNaturalUnit,
} from '../libs/units'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
}

// Gets fresh logs
function* getFreshLogs() {
  const eth = yield select(selectEthjs)
  const registry = yield select(selectRegistry)
  try {
    const applications = yield call(handleLogs, eth, registry, '_Application')
    console.log('applications', applications)

    const challenges = yield call(handleLogs, eth, registry, '_Challenge')

    // const ndwl = yield call(handleLogs, eth, registry, '_NewDomainWhitelisted')
    // console.log('ndwl', ndwl)

    // const ar = yield call(handleLogs, eth, registry, '_ApplicationRemoved')
    // console.log('ar', ar)

    // const trueWhitelist = fromJS(ndwl)
    // const wlll = trueWhitelist.filter(wl => !ar.filter(a => a.domain === wl.get('domain')))
    // console.log('trueWhitelist', wlll.toJS())

    // const apps = applications.filter(app => !app.challengeID && !app.whitelisted)
    // console.log('apps', apps)

    // const whitelist = applications.filter(app => app.whitelisted)
    // console.log('whitelist', whitelist)

    // const challenged = apps.filter(app => app.challengeID)
    // console.log('challenged', challenged)

    // const canBeWhitelistedLogs = yield call(logUtils.canBeWhitelisted, registry, applications)
    // console.log('canBeWhitelistedLogs', canBeWhitelistedLogs)

    yield put(setDecodedLogs(applications))
    yield put(setDecodedLogs(challenges))
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}


function* handleLogs(eth, registry, topic) {
  const filter = yield call(logUtils.buildFilter, registry.address, topic)
  const rawLogs = yield call(eth.getLogs, filter)
  const decodedLogs = yield call(logUtils.decodeLogs, eth, registry.contract, rawLogs)

  return yield all(
    yield all(decodedLogs.map(async (dLog, ind) => {
      const block = await commonUtils.getBlock(eth, rawLogs[ind].blockHash)
      const txDetails = await commonUtils.getTransaction(eth, rawLogs[ind].transactionHash)

      return call(buildRegistryItem, rawLogs, registry, block, dLog, ind, txDetails)
    }))
  )
}

function* buildRegistryItem(rawLogs, registry, block, log, i, txDetails) {
  let unstakedDeposit = '0'
  if (log.deposit) {
    unstakedDeposit = fromNaturalUnit(log.deposit).toString(10)
  }

  const isWhitelisted = yield call(commonUtils.isWhitelisted, registry, log.domain)
  let status = 'challengeable'

  if (!isWhitelisted) {
    const canBeWhitelisted = yield call(commonUtils.canBeWhitelisted, registry, log.domain)
    if (canBeWhitelisted) {
      status = 'whitelistable'
    }
  }
  // console.log('log', log)
  // console.log('rawLogs', rawLogs)
  // console.log('txDetails', txDetails)

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
    status,
    isWhitelisted,
  }

  return commonUtils.shapeShift(block, tx, details)
}