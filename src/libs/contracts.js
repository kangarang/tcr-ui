import ethers from 'ethers'

import { setupSignerProvider } from './provider'

export async function setupRegistry(provider, abi, address) {
  const signerProvider = await setupSignerProvider(provider)
  return new ethers.Contract(address, abi, signerProvider)
}

export async function setupContract(provider, abi, registry, sc) {
  const signerProvider = await setupSignerProvider(provider)
  const address = await registry[sc]()
  return new ethers.Contract(address, abi, signerProvider)
}
