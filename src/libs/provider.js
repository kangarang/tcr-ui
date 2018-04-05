import ethers from 'ethers'
import providers from 'ethers/providers'

const NODE_ENV = process.env.NODE_ENV

export function setProvider(networkId) {
  let chainId = 4 // default rinkeby
  if (networkId) {
    chainId = networkId
  }
  if (
    typeof window !== 'undefined' &&
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    return new providers.Web3Provider(window.web3.currentProvider, { chainId })
  }
  if (NODE_ENV === 'test' || NODE_ENV === 'development') {
    return new providers.JsonRpcProvider('http://localhost:8545', { chainId })
  }
  return new providers.getDefaultProvider()
}

export async function setupSignerProvider(provider) {
  if (typeof provider.listAccounts !== 'undefined') {
    const accounts = await provider.listAccounts()
    return provider.getSigner(accounts[0])
  }

  if (NODE_ENV === 'test' || NODE_ENV === 'development') {
    const wallet = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
    wallet.resolveName = () => {}
    wallet.provider = provider
    return wallet
  }

  if (provider.privateKey && provider) {
    return new ethers.Wallet(provider.privateKey, provider)
  }
}
