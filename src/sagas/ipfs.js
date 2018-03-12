import { call, takeEvery } from 'redux-saga/effects'
import ipfsAPI from 'ipfs-api'

import { IPFS_ADD_REQUEST } from 'actions/constants'
import { getIPFSData } from 'libs/ipfs'

export default function* ipfsSaga() {
  yield takeEvery(IPFS_ADD_REQUEST, ipfsAddSaga)
}

export function* ipfsAddSaga(action) {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = yield call(ipfsAPI, config)

  const { id, data } = action.payload

  // TODO: id: data | verify keccak256
  const CID = yield new Promise((resolve, reject) => {
    const obj = {
      id,
      data,
    }
    ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })

  const content = yield call(getIPFSData, CID[0].hash)
  console.log('ipfs content added:', content)

  return CID[0].hash
}
