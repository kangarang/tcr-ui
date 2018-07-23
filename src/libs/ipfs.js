import IPFS from 'ipfs-mini'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export function ipfsCheckMultihash(multihash) {
  if (typeof multihash !== 'string') {
    return false
  }
  if (multihash.startsWith('Qm') && multihash.length === 46) {
    return true
  }
  return false
}

// TODO: typescript string
export async function ipfsGetData(multihash) {
  if (ipfsCheckMultihash(multihash)) {
    return new Promise((resolve, reject) => {
      ipfs.catJSON(multihash, (err, result) => {
        if (err) reject(new Error(err))
        resolve(result)
      })
    })
  }
}

// TODO: typescript object
export async function ipfsAddObject(obj) {
  const CID = await new Promise((resolve, reject) => {
    ipfs.addJSON(obj, (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
  console.log('CID:', CID)

  // TODO: write to config
  // if (process.argv[1].includes('addABIs')) {
  //   fs.writeJsonSync('./config/')
  // }

  return CID
}
