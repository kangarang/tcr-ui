import ipfsAPI from 'ipfs-api'
import _ from 'lodash/fp'

// import IPFS from 'ipfs-mini'
// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
const ipfs = ipfsAPI(config)

export async function ipfsGetData(multihash) {
  if (!_.isString(multihash)) {
    return new Error('multihash must be String')
  } else if (!multihash.startsWith('Qm')) {
    return new Error('multihash must start with "Qm"')
  }

  let content
  const ipfsPath = await ipfs.files.get(multihash)
  ipfsPath.forEach(file => {
    // console.log(file)
    content = JSON.parse(file.content.toString('utf8'))
  })
  return content
}

// TODO: type checking
// TODO: add tests
export async function ipfsAddObject(obj) {
  // TODO: verify keccak256
  const CID = await new Promise((resolve, reject) => {
    ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
  console.log('CID:', CID)
  return CID[0].hash
}
