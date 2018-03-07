import { call, put, takeEvery } from 'redux-saga/effects'
import ipfsAPI from 'ipfs-api'
import { IPFS_ADD_DATA_REQUEST } from '../actions/constants'

export default function* ipfsSaga() {
  yield takeEvery(IPFS_ADD_DATA_REQUEST, addDataSaga)
  // yield call(addDataSaga, {
  //   payload: {
  //     data: 'consensysclassic.net',
  //     listingHash:
  //       '0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2',
  //   },
  // })
}
export function* addDataSaga(action) {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = yield call(ipfsAPI, config)

  const { data, listingHash } = action.payload

  const fileHash = yield new Promise((resolve, reject) => {
    const obj = {
      id: listingHash,
      data,
    }
    ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })

  const fileThing = yield call(ipfs.files.get, fileHash[0].hash)

  let content
  yield fileThing.forEach(file => {
    console.log(file.path)
    content = file.content.toString('utf8')
  })
  console.log('content', content)

  return fileHash[0].hash
  // list keys
  // const keys = yield call(ipfs.key.list)
  // console.log('keys', keys)

  // remove a key
  // const removedKey = yield call(ipfs.key.rm, keys[2].name)
  // console.log('removedKey', removedKey)

  // list all linked data to gateway?
  // const links = yield call(ipfs.refs.local)
  // console.log('links', links)
  // swarm
  // return ipfs.swarm.peers((err, peerInfos) => {
  //   if (err) {
  //     console.log('err', err)
  //     throw err
  //   }
  //   console.log('peerInfos', peerInfos)
  //   return peerInfos
  // })
}
