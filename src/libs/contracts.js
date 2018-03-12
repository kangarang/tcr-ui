import ethers from 'ethers'

export async function setupRegistry(provider, abi, address) {
  const accounts = await provider.listAccounts()
  const signer = await provider.getSigner(accounts[0])

  return new ethers.Contract(address, abi, signer)
}

export async function setupContract(provider, abi, registry, sc) {
  const accounts = await provider.listAccounts()
  const signer = await provider.getSigner(accounts[0])

  const address = await registry.functions[sc]()
  return new ethers.Contract(address, abi, signer)
}
