import { IPFS_ADD_DATA_REQUEST, IPFS_ABI_RETRIEVED } from './constants'

export function ipfsAbiRetrieved(payload) {
  return {
    type: IPFS_ABI_RETRIEVED,
    payload,
  }
}
export function ipfsAddData(payload) {
  return {
    type: IPFS_ADD_DATA_REQUEST,
    payload,
  }
}
