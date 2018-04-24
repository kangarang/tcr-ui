import { addABIs } from '../addABIs'

describe.skip('add abis to interplanetary file system', () => {
  test('should return the correct multihash when adding abis to ipfs', async () => {
    const hash = await addABIs()
    expect(hash).toBe('QmSQsB3bLhdTzKMttmn1JqtPSGehtkdTkDv3qx6e7UT15L')
  })
})
