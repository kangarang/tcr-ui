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
import { findListing } from 'modules/listings/utils'

import { selectAllListings } from 'modules/listings/selectors'
import { selectTCR } from 'modules/home/selectors'
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

    const { title, message } = yield call(
      getNotificationTitleAndMessage,
      eventName,
      logData,
      tcr,
      listing
    )

    if (title) {
      const noti = {
        uid: txData.txHash,
        title,
        message,
        position: 'bl',
        autoDismiss: 10,
        // action: {
        //   label: 'cb',
        //   callback: () => console.log('click!'),
        // },
      }
      yield put(info(noti))
    }
  } catch (error) {
    console.log('notificationsSaga error:', error)
  }
}
