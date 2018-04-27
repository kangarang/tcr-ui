const fs = require('fs-extra')
const path = require('path')
const { ipfsTokensHash, ipfsGetData } = require('../src/redux/libs/ipfs')

// see: https://github.com/ethereum-lists/tokens
// & -> https://github.com/MyCryptoHQ/MyCrypto/blob/develop/scripts/update-tokens.ts
async function run() {
  const tokens = await ipfsGetData(ipfsTokensHash)

  // Write to the file
  console.log('Writing Tokens JSON to src/config/tokens/eth.json...')
  const filePath = path.resolve(__dirname, '../src/config/tokens/eth.json')
  fs.writeFile(filePath, JSON.stringify(tokens, null, 2), 'utf8', err => {
    if (err) {
      console.error(err)
      throw new Error('Failed to write tokens json to file, see above error')
    }
    console.log('Succesfully imported', tokens.length, 'tokens!')
  })
}

run()
