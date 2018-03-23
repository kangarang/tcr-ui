## InterPlanetary File System

https://medium.com/@ConsenSys/an-introduction-to-ipfs-9bba4860abd0

“When you have IPFS, you can start looking at everything else in one specific way and you realize that you can replace it all” — Juan Benet

"IPFS uses content addressing at the HTTP layer. This is the practice of saying instead of creating an identifier that addresses things by location, we’re going to address it by some representation of the content itself. This means that the content is going to determine the address. The mechanism is to take a file, hash it cryptographically so you end up with a very small and secure representation of the file which ensures that someone can not just come up with another file that has the same hash and use that as the address. The address of a file in IPFS usually starts with a hash that identifies some root object and then a path walking down. Instead of a server, you are talking to a specific object and then you are looking at a path within that object."

**IPFS Pseudocode example:**

```js
const listingString = 'consensysclassic.net'

const obj = {
  id: listingString,
}

const CID = ipfs.files.add(Buffer.from(JSON.stringify(obj)))
// CID: Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7

const listingHash = keccak256(listingString)
// 0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2
registry.apply(listingHash, 50000, CID)

// mining...

// on the client side...

// event _Application(listingHash, deposit, data)
// _Application('0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2', 50000, 'Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7')

const eventResult = [
  '0xfc11ba76da281550e957189c9909d866c8fb72034ec6724e6a60906a776d0fe2',
  50000,
  'Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7',
]

// const listing = registry.listings.call(eventResult[0])
// listing: [applicationExpiry, whitelisted, owner, unstakedDeposit, challengeID]

const ipfsPath = ipfs.files.get(eventResult[2])

ipfsPath.forEach(file => {
  console.log(file.path)
  // Qmf2CPd4ZwpP7vGEHvsk8DWdvatxSdc7iXXBv2bRJvuCp7
  console.log(file.content.toString('utf8'))
  // {"id":"consensysclassic.net"}
})
```