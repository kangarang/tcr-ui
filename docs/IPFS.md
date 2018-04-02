## InterPlanetary File System

https://medium.com/@ConsenSys/an-introduction-to-ipfs-9bba4860abd0

“When you have IPFS, you can start looking at everything else in one specific way and you realize that you can replace it all” — Juan Benet

"IPFS uses content addressing at the HTTP layer. This is the practice of saying instead of creating an identifier that addresses things by location, we’re going to address it by some representation of the content itself. This means that the content is going to determine the address. The mechanism is to take a file, hash it cryptographically so you end up with a very small and secure representation of the file which ensures that someone can not just come up with another file that has the same hash and use that as the address. The address of a file in IPFS usually starts with a hash that identifies some root object and then a path walking down. Instead of a server, you are talking to a specific object and then you are looking at a path within that object."

---

### Prospect Park IPFS conventions

`function apply(bytes32 _listingHash, uint _deposit, string _data)`

In the `apply` function, the `_data` field is either:
  - a string that, when hashed with keccak256, is the value `_listingHash`
  - a string that is a valid ipfs multihash:
    * when resolved, is a JSON object which contains key `id`
    * the value of `id`, when hashed with keccak256, is the value `_listingHash`

`_data`
  - ipfs multihash: `Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7`
  - string: 'consensysclassic.net'

`_listingHash`: the keccak256 hash of the `id` key's value of the JSON object that is resolved at the `_data` ipfs multihash
  - e.g. `keccak256(ipfs.get(_data).id)`
  - `// 0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2`

#### Pseudocode example

```js
// Build an object to be added to IPFS
const listingString = 'consensysclassic.net'
const obj = {
  id: listingString,
}

// Compute the listingHash offline
const listingHash = keccak256(listingString)
// 0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2

// Add the JSON object to IPFS
const CID = ipfs.files.add(Buffer.from(JSON.stringify(obj)))
console.log(CID[0].hash)
// Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7

// Data is the ipfs multihash of the added json object
const data = CID[0].hash
// Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7

// If you called ipfs.get(data), you will be able to see the json obj
// This is what clients will do to build the context of the application (see below)
const ipfsPath = ipfs.files.get(data)
// { "id": "consensysclassic.net" }

// Apply
registry.apply(listingHash, 50000, data)

// mining...

// on the client side...

// event _Application(listingHash, deposit, data)
// _Application('0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2', 50000, 'Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7')

const eventResult = [
  '0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2',
  50000,
  'Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7',
]

const ipfsPath = ipfs.files.get(eventResult[2])

ipfsPath.forEach(file => {
  console.log(file.path)
  // Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7
  console.log(file.content.toString('utf8'))
  // {"id":"consensysclassic.net"}
})
```