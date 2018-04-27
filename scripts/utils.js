const IPFS = require('ipfs-mini')
const isString = require('lodash/fp/isString')

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

async function ipfsGetData(multihash) {
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
async function ipfsAddObject(obj) {
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

const ipfsABIsHash = 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu'
const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'

module.exports = {
  ipfsGetData,
  ipfsAddObject,
  ipfsABIsHash,
  ipfsTokensHash,
}
