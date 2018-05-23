## InterPlanetary File System

https://medium.com/@ConsenSys/an-introduction-to-ipfs-9bba4860abd0

“When you have IPFS, you can start looking at everything else in one specific way and you realize that you can replace it all” — Juan Benet

"IPFS uses content addressing at the HTTP layer. This is the practice of saying instead of creating an identifier that addresses things by location, we’re going to address it by some representation of the content itself. This means that the content is going to determine the address. The mechanism is to take a file, hash it cryptographically so you end up with a very small and secure representation of the file which ensures that someone can not just come up with another file that has the same hash and use that as the address. The address of a file in IPFS usually starts with a hash that identifies some root object and then a path walking down. Instead of a server, you are talking to a specific object and then you are looking at a path within that object."

---

### Prospect Park IPFS conventions

```solidity
function apply(bytes32 _listingHash, uint _deposit, string _data) { ... }
```

In the `apply` function...

**`_data` is one of the following**

1.  a valid ipfs multihash

    * e.g. `Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7`
    * when resolved, is a JSON object which contains key `id`
    * the value of `id`, when hashed with keccak256, is the value `_listingHash`

2.  a plaintext string that, when hashed with keccak256, is the value `_listingHash`
    * e.g. `'consensysclassic.net'`

**`_listingHash` is one of the following**

1.  if `_data` is an ipfs multihash, `_listingHash` is:

    * the keccak256 hash of the `id` key's value of the JSON object that is resolved at the `_data` ipfs multihash
    * i.e. `keccak256(ipfs.get(_data).id)`

2.  if `_data` is a plaintext string, or an invalid ipfs multihash, `_listingHash` is:
    * the keccak256 hash of `_data`
    * e.g. `keccak256('consensysclassic.net')`

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
const CID = ipfs.addJSON(obj)
console.log(CID)
// Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7

// `data` is the ipfs multihash of the added json object
const data = CID

// If you called ipfs.catJSON(data) right now, you will be able to see the json obj
// { "id": "consensysclassic.net" }
// This is what clients will do once they see the application log
// to build the context of the application (see below)

// Apply
registry.apply(listingHash, 50000, data)

// mining...

// on the client side...

// event _Application(listingHash, deposit, data)
// _Application('0xfc11ba76da28...', 50000, 'Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7')

const eventResult = [
  '0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2', // listingHash
  50000, // deposit
  'Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7', // data - ipfs multihash
]

const ipfsContent = ipfs.catJSON(eventResult[2])
// {"id":"consensysclassic.net"}
```
