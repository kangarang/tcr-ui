import { IPFS_ADD_REQUEST, IPFS_ABI_RETRIEVED } from './constants'

export function ipfsAbiRetrieved(payload) {
  return {
    type: IPFS_ABI_RETRIEVED,
    payload,
  }
}
export function ipfsAddRequest(payload) {
  return {
    type: IPFS_ADD_REQUEST,
    payload,
  }
}
