import { select, call } from 'redux-saga/effects'
import _ from 'lodash/fp'

import { selectRegistry } from 'state/ducks/home/selectors'

import { ipfsAddData } from 'state/libs/ipfs'
import { getListingHash } from 'state/libs/values'

import { sendTransactionSaga } from './index'

export function* registryTxnSaga(action) {
  try {
    const registry = yield select(selectRegistry)
    const { methodName, args } = action.payload

    let finalArgs = _.clone(args)

    if (methodName === 'apply') {
      const fileHash = yield call(ipfsAddData, {
        id: args[0], // listing string (name)
        data: args[2], // data (address)
      })
      // hash the string
      finalArgs[0] = getListingHash(args[0])
      // use ipfs CID as the _data field in the application
      finalArgs[2] = fileHash
    }

    console.log('finalArgs', finalArgs)

    yield call(sendTransactionSaga, registry, methodName, finalArgs)
  } catch (error) {
    console.log('registryTxn error', error)
  }
}
