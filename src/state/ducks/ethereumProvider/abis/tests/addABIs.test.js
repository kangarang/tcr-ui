import { addABIs } from '../addABIs'

describe.skip('add abis to interplanetary file system', () => {
  test('should return the correct multihash when adding abis to ipfs', async () => {
    const hash = await addABIs()
    expect(hash).toBe('QmZpeget91fUBZyw9LfhwvB3X5iPTkWLiTtRioWcdrU1LE')
  })
})
