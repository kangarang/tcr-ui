import { select, call, put } from 'redux-saga/effects'
import {
  // show,
  // success,
  // error,
  // warning,
  info,
  // hide,
  // removeAll,
} from 'react-notification-system-redux'

import { getNotificationTitleAndMessage } from './utils'
import { findListing } from 'redux/modules/listings/utils'

import { selectAllListings } from 'redux/modules/listings/selectors'
import { selectTCR } from 'redux/modules/home/selectors'
import { handleMultihash } from '../../listings/utils'

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

    const { title, message } = getNotificationTitleAndMessage(
      eventName,
      logData,
      tcr,
      listing
    )

    if (title && message) {
      const noti = {
        uid: txData.txHash + txData.logIndex + logData._eventName,
        title,
        message,
        position: 'bl',
        autoDismiss: 0,
        action: {
          label: 'Click',
          callback: () => console.log('click!'),
        },
      }
      yield put(info(noti))
    }
  } catch (error) {
    console.log('notificationsSaga error:', error)
  }
}
