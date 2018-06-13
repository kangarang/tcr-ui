import IPFS from 'ipfs-mini'
// import fs from 'fs-extra'
// import ow from 'ow'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export async function ipfsGetData(multihash) {
  // ow(multihash, ow.string)

  if (!multihash.startsWith('Qm')) {
    return new Error('multihash must start with "Qm"')
  }

  return new Promise((resolve, reject) => {
    ipfs.catJSON(multihash, (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
}

export async function ipfsAddObject(obj) {
  // ow(obj, ow.object)

  const CID = await new Promise((resolve, reject) => {
    ipfs.addJSON(obj, (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
  console.log('CID:', CID)

  // if (process.argv[1].includes('addABIs')) {
  //   fs.writeJsonSync('./config/')
  // }

  return CID
}

// mainnet: adChain, rinkeby: sunset, 420: test, 9001: test
export const ipfsABIsHash = 'QmQSxEDhY9nJUMjDXA1xVek5fcBzgLpwcjgbQwtjrEJrfi'

export const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'
