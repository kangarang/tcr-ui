import ipfsAPI from 'ipfs-api'
import abis from '../abis'

const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
const ipfs = ipfsAPI(config)

const CID = new Promise((resolve, reject) => {
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

const ipfsPath = ipfs.files.get(CID[0].hash)

let content
ipfsPath.forEach(file => {
  console.log(file.path)
  content = file.content.toString('utf8')
})

const ipfsJSON = JSON.parse(content)
console.log('ipfsJSON', ipfsJSON)
