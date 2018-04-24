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
import { findListing } from 'state/ducks/listings/utils'

import { selectTCR, selectAllListings } from 'state/ducks/home/selectors'
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
    if (logData.data && logData.data.length === 46 && logData.data.includes('Qm')) {
      const { listingID } = yield call(handleMultihash, logData.listingHash, logData.data)
      logData.data = listingID
    }
    // TODO: change .toJS()
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
        position: 'tr',
        autoDismiss: 0,
        action: {
          label: 'See more',
          callback: () => console.log('click!'),
        },
      }
      yield put(info(noti))
    }
  } catch (error) {
    console.log('notificationsSaga error:', error)
  }
}
