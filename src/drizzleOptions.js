import Registry from './abis/Registry.json'
import Token from './abis/EIP20.json'

const options = {
  contracts: [Registry, Token],
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
  polls: {
    blocks: 3000,
    accounts: 2000,
  },
  events: {
    Registry: ['_Application', '_Challenge'],
  },
}

export default options
