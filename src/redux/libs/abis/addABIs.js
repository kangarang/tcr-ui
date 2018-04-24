import abis from './index'
import { ipfsAddObject } from 'redux/libs/ipfs'

export async function addABIs() {
  const data = {
    id: 'Prospect Park',
    registry: abis.registry,
    token: abis.token,
    voting: abis.voting,
    parameterizer: abis.parameterizer,
  }
  const hash = await ipfsAddObject(data)
  return hash
}
