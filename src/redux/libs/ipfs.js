import IPFS from 'ipfs-mini'
import isString from 'lodash/fp/isString'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export async function ipfsGetData(multihash) {
  if (!isString(multihash)) {
    return new Error('multihash must be String')
  } else if (!multihash.startsWith('Qm')) {
    return new Error('multihash must start with "Qm"')
  }

  return new Promise((resolve, reject) => {
    ipfs.catJSON(multihash, (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
}

// TODO: type checking
// TODO: add tests
export async function ipfsAddObject(obj) {
  // TODO: verify keccak256
  const CID = await new Promise((resolve, reject) => {
    ipfs.addJSON(obj, (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
  console.log('CID:', CID)
  return CID
}

export const ipfsABIsHash = 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu'
export const ipfsTokensHash = 'QmeGuDXfZAa24HYg2orHNbYxMNgNARuo3ioV6xf38GS9jb'
