import { call, takeEvery } from 'redux-saga/effects'
import ipfsAPI from 'ipfs-api'

import { IPFS_ADD_DATA_REQUEST } from 'actions/constants'

export default function* ipfsSaga() {
  yield takeEvery(IPFS_ADD_DATA_REQUEST, ipfsAddDataSaga)
}

export function* ipfsAddDataSaga(action) {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = yield call(ipfsAPI, config)

  const { name, listingHash, data } = action.payload

  // TODO: id: data | verify keccak256
  const CID = yield new Promise((resolve, reject) => {
    const obj = {
      id: listingHash,
      name,
      data,
    }
    ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })

  const ipfsPath = yield call(ipfs.files.get, CID[0].hash)

  let content
  yield ipfsPath.forEach(file => {
    console.log(file.path)
    content = file.content.toString('utf8')
  })
  console.log('content', content)

  return CID[0].hash
}
