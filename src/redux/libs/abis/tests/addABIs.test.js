import { addABIs } from '../addABIs'
import { ipfsABIsHash } from 'redux/libs/ipfs'

describe.skip('add abis to interplanetary file system', () => {
  test('should return the correct multihash when adding abis to ipfs', async () => {
    const hash = await addABIs()
    expect(hash).toBe(ipfsABIsHash)
  })
})
