import IPFS from 'ipfs-mini'
import _ from 'lodash/fp'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export function ipfsCat(multihash) {
  // typechecking
  if (!_.isString(multihash)) {
    return new Error('multihash must be String')
  } else if (!multihash.startsWith('Qm')) {
    return new Error('multihash must start with "Qm"')
  }

  const content = ipfs.catJSON(multihash, (err, result) => {
    console.log('err, result', err, result)
    if (!err) {
      return result
    }
  })
  console.log('content', content)
  return content
}

// const ipfsPath = await ipfs.files.get(multihash)
// let content
// ipfsPath.forEach(file => {
//   // console.log(file.path)
//   content = JSON.parse(file.content.toString('utf8'))
// })
// return content

// TODO: type checking
// TODO: add tests
// export async function ipfsAddData(obj) {
//   const config = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' }
//   const ipfs = ipfsAPI(config)

//   // TODO: id: data | verify keccak256
//   const CID = await new Promise((resolve, reject) => {
//     ipfs.files.add(Buffer.from(JSON.stringify(obj)), (err, result) => {
//       if (err) reject(new Error(err))
//       resolve(result)
//     })
//   })

//   const content = await ipfsGetData(CID[0].hash)
//   console.log(`${CID[0].hash.substring(0, 8)} added: ${JSON.stringify(content)}`)
//   return CID[0].hash
// }
