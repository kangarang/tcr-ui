import IPFS from 'ipfs-mini'
// import fs from 'fs-extra'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

// TODO: typescript string
export async function ipfsGetData(multihash) {
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

// TODO: typescript object
export async function ipfsAddObject(obj) {
  const CID = await new Promise((resolve, reject) => {
    ipfs.addJSON(obj, (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
  console.log('CID:', CID)

  // TODO: write to ipfs.json config
  // if (process.argv[1].includes('addABIs')) {
  //   fs.writeJsonSync('./config/')
  // }

  return CID
}

// mainnet: adChain, rinkeby: sunset, 420: test, 9001: test
export const ipfsABIsHash = 'QmZ7uvuHaGStLUzndbtDNjjsGaijKM9JEZjeMnt3MVCA8s'

export const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'
