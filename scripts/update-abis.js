import abis from './abis'
import { ipfsAddObject } from 'libs/ipfs'

const data = {
  id: 'Prospekt Park',
  registry: abis.registry,
  token: abis.token,
  voting: abis.voting,
  parameterizer: abis.parameterizer,
}

ipfsAddObject(data).then(hash => {
  console.log('object added to ipfs. hash:', hash)
})
