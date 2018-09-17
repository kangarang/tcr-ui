import { all, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { createListing } from '../utils'

// ipfs.infura rate limit: > 4 requests at a time
// workaround: batch the applications and concat results
export function* batchCreateListings(applications, listings) {
  try {
    // get the first 4 in the list
    const chunkApplications = applications.slice(0, 4)

    // if there are any,
    if (chunkApplications.length > 0) {
      console.log('batching..')
      // create listings with those 4
      const chunkListings = yield all(
        chunkApplications.map(application => createListing(application.logData, application.txData))
      )
      // if there are more than 4 in the list, wait
      if (applications.length > 4) {
        yield call(delay, 400)
      }

      // recursion.
      // this time with all BUT the first 4 in the list
      // concat the listings with the newly created 4 listings
      return yield call(batchCreateListings, applications.slice(4), listings.concat(chunkListings))
    }
    return listings
  } catch (error) {
    console.log('Failed to batch-create listings:', error)
  }
}
