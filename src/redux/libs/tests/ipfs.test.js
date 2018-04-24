import { ipfsGetData } from '../ipfs'

describe('libs: ipfs', async () => {
  describe('function: ipfsGetData', () => {
    test.skip('should return the correct ipfs object id', async () => {
      const data = await ipfsGetData('QmeCTiFp7VUgPBnxQcWfNjrxFeh9eeScSx8VUKE2344beo')
      expect(data.id).toBe('Prospect Park')
    })
  })
})
