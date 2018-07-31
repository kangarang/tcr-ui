import { select, call, put } from 'redux-saga/effects'
import { info } from 'react-notification-system-redux'

import * as actions from '../actions'

import { getNotificationTitleAndMessage } from './utils'
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

    if (title) {
      const noti = {
        uid: txData.txHash,
        title,
        message,
        position: 'tl',
        autoDismiss: 10,
        // action: {
        //   label: 'cb',
        //   callback: () => console.log('click!'),
        // },
      }
      yield put(info(noti))
    }
  } catch (err) {
    yield put(actions.showNotificationFailed(err))
  }
}
