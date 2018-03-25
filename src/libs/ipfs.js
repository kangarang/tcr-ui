import ipfsAPI from 'ipfs-api'

// TODO: type checking
export const getIPFSData = async multihash => {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = await ipfsAPI(config)
  const ipfsPath = await ipfs.files.get(multihash)

  let content
  ipfsPath.forEach(file => {
    // console.log(file.path)
    content = JSON.parse(file.content.toString('utf8'))
  })
  return content
}

// TODO: type checking
export async function ipfsAddData(obj) {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = ipfsAPI(config)

  // TODO: id: data | verify keccak256
  const CID = await new Promise((resolve, reject) => {
    ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
      if (err) reject(new Error(err))
      resolve(result)
    })
  })

  // const content = await getIPFSData(CID[0].hash)
  // console.log('ipfs content added:', content)
  return CID[0].hash
}
