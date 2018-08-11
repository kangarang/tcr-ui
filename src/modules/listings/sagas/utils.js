import { all, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { createListing } from '../utils'

// ipfs.infura rate limit: > 4 requests at a time
// workaround: batch the applications and concat results
export function* batchCreateListings(applications, listings) {
  try {
    const chunkApplications = applications.slice(0, 4)

    if (chunkApplications.length > 0) {
      console.log('batching..')
      const chunkListings = yield all(
        chunkApplications.map(application =>
          createListing(application.logData, application.txData)
        )
      )
      if (applications.length > 4) {
        yield call(delay, 400)
      }

      return yield call(
        batchCreateListings,
        applications.slice(4),
        listings.concat(chunkListings)
      )
    }
    return listings
  } catch (error) {
    console.log('Failed to batch-create listings:', error)
  }
}
