import utils from 'ethers/utils'
import { checkHttpStatus, parseJSON } from './utils'

// adapted from: https://github.com/MyCryptoHQ/MyCrypto/blob/develop/common/api/gas.ts
export async function getGasPrice(network) {
  if (network === 'rinkeby') {
    return '20000000000'
  }
  const prices = await fetch('https://dev.blockscale.net/api/gasexpress.json', {
    mode: 'cors',
  })
    .then(checkHttpStatus)
    .then(parseJSON)

  return utils.parseUnits(prices.standard.toString(), 'gwei')
}
