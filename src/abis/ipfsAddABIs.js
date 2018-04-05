import ipfsAPI from 'ipfs-api'
import abis from './index'

export async function addABIs() {
  const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
  const ipfs = ipfsAPI(config)

  const data = {
    id: 'Prospect Park',
    registry: abis.registry,
    token: abis.token,
    voting: abis.voting,
    parameterizer: abis.parameterizer,
  }

  const CID = await ipfs.files.add(Buffer.from(JSON.stringify(data)))
  console.log('CID', CID)
  return CID
}
