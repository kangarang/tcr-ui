import ipfsAPI from 'ipfs-api'
import abis from '../abis'

export const getIPFSData = async multihash => {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = await ipfsAPI(config)
  const ipfsPath = await ipfs.files.get(multihash)
  let content
  ipfsPath.forEach(file => {
    console.log(file.path)
    content = JSON.parse(file.content.toString('utf8'))
  })
  return content
}

export async function ipfsAddABIs() {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = ipfsAPI(config)

  const CID = await new Promise((resolve, reject) => {
    const obj = {
      id: 'Prospect Park',
      registry: abis.registry,
      token: abis.token,
      voting: abis.voting,
      parameterizer: abis.parameterizer,
    }

    ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })
  console.log('CID', CID)

  const ipfsPath = await ipfs.files.get(CID[0].hash)
  console.log('ipfsPath', ipfsPath)

  let content
  ipfsPath.forEach(file => {
    console.log(file.path)
    content = file.content.toString('utf8')
  })

  const ipfsJSON = JSON.parse(content)
  console.log('ipfsJSON', ipfsJSON)
}
