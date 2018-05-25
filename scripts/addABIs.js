import abis from './abis'
import { ipfsAddObject } from 'redux/libs/ipfs'

async function addABIs() {
  const data = {
    id: 'Prospect Park',
    registry: abis.registry,
    token: abis.token,
    voting: abis.voting,
    parameterizer: abis.parameterizer,
  }
  const hash = await ipfsAddObject(data)
  console.log('object added to ipfs. hash:', hash)
  return hash
}

addABIs()
