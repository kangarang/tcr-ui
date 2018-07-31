import { select, call, put } from 'redux-saga/effects'
import { info, success, error, warning } from 'react-notification-system-redux'

import * as actions from '../actions'

import { getNotificationTitleAndMessage, generateNoti, eventTypes } from './utils'
import { findListing, handleMultihash } from 'modules/listings/utils'

import { selectAllListings } from 'modules/listings/selectors'
import { selectTCR } from 'modules/home/selectors'

export function* notificationsSaga(log) {
  try {
    const { logData, txData, eventName } = log
    const tcr = yield select(selectTCR)
    const listings = yield select(selectAllListings)

    let listing
    // search for corresponding listing
    const matchingListing = yield call(findListing, logData, listings)
    if (matchingListing) {
      listing = matchingListing.toJS()
    }

    // ipfs multihash
    if (logData.data && logData.data.length === 46 && logData.data.includes('Qm')) {
      const { listingID } = yield call(handleMultihash, logData.listingHash, logData.data)
      logData.data = listingID
    }

    const { title, message } = yield call(
      getNotificationTitleAndMessage,
      eventName,
      logData,
      tcr,
      listing
    )

    const noti = yield call(generateNoti, txData.txHash, title, message, {
      label: 'action',
      callback: () => console.log('ACTION'),
    })
    yield call(notify, noti, eventTypes[eventName])
  } catch (err) {
    yield put(actions.showNotificationFailed(err))
  }
}

function* notify(noti, type, callback = function() {}) {
  switch (type) {
    case 'success':
      yield put(success(noti))
      break
    case 'info':
      yield put(info(noti))
      break
    case 'warning':
      yield put(warning(noti))
      break
    case 'error':
      yield put(error(noti))
      break
    default:
      console.log('ERROR IN CALLING this.notify()')
  }
  callback()
}
