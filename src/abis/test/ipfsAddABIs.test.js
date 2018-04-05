import { addABIs } from '../ipfsAddABIs'

describe.skip('add abis to interplanetary file system', () => {
  test('should return the correct multihash when adding abis to ipfs', async () => {
    const cid = await addABIs()
    expect(cid[0].hash).toBe('QmeCTiFp7VUgPBnxQcWfNjrxFeh9eeScSx8VUKE2344beo')
  })
})
