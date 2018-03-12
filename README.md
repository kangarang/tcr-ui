# TCR UI (WIP)

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to curate and reach decentralized consensus on a Registry of high-quality entries

The vision of this project is to build a registry-agnostic client-side user interface to interact and transact with Ethereum TCRs

---

## Articles

[Token-Curated Registries 1.0](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)

[Token-Curated Registry 1.1, 2.0](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)

[Continuous Token-Curated Registries: The Infinity of Lists](https://medium.com/@simondlr/continuous-token-curated-registries-the-infinity-of-lists-69024c9eb70d)

[City Walls & Bo-Taoshi: Exploring the Power of Token-Curated Registries](https://medium.com/@simondlr/city-walls-bo-taoshi-exploring-the-power-of-token-curated-registries-588f208c17d5)

## Resources

[TCR](https://github.com/skmgoldin/tcr)

[TCR (forked)](https://github.com/kangarang/tcr)

[Gitter channel](https://gitter.im/Curation-Markets/Lobby)

[PLCR Voting](https://github.com/ConsenSys/PLCRVoting)

[AdChain Registry](https://github.com/AdChain/AdChainRegistry)

[AdChain Registry Dapp](https://github.com/AdChain/AdChainRegistryDapp)

---

## Commands

### **Local blockchain/RPC** (optional)

[ganache-cli](https://github.com/trufflesuite/ganache-cli) - `http://localhost:8545`

```
  $ npm install -g ganache-cli
  $ ganache-cli

  (some flags)
  --port:  8545
  -v:      verbose debugging
  -b:      auto-mine blocks (seconds)
  -i:      network id
  --db     persistent local storage
```

### **Run**

Start development server: `http://localhost:3000`

```
  $ npm run dev
```

### **Deploy**

Clone contracts

```
  $ git clone git@github.com:kangarang/tcr.git
  $ cd tcr
  $ npm install
```

Build JSON ABI artifacts

(Note: only have to run once. _While ganache-cli is running_)

```
  $ npm run compile
```

Deploy contracts to local RPC

```
  $ npm run deploy-test
```

Deploy contracts to Rinkeby Test Network

```
  $ npm run deploy-rinkeby
```

Deploy contracts to Main Network

```
  $ npm run deploy-mainnet
```

Deploy UI to elastic beanstalk (ask for credentials)

```
  $ eb deploy
```

---

## Transactions (in generally chronologic order):

```
token.approve(address _spender, uint _value)
```

* allows `_spender` to transfer tokens on behalf of `msg.sender`, up to `_value`
* in our case, `_spender` is Registry, PLCRVoting, or Parameterizer
* `msg.sender`: any

---

```
  registry.apply(bytes32 _listingHash, uint _amount, string _data)
```

* applies a Listing to the Registry
* `msg.sender`: becomes Listing owner

---

```
  registry.challenge(bytes32 _listingHash, string _data)
```

* challenges a Listing (either in-application or whitelisted)

---

```
  registry.deposit(bytes32 _listingHash, uint _amount)
```

* increases the deposit stake associated with a Listing
* `msg.sender`: must be Listing owner

---

```
  registry.withdraw(bytes32 _listingHash, uint _amount)
```

* decreases the deposit stake associated with a listing
* `msg.sender`: must be Listing owner

---

```
  registry.exit(bytes32 _listingHash)
```

* removes a registered Listing from the registry
* `msg.sender`: must be owner of listing

---

```
  registry.updateStatus(bytes32 _listingHash)
```

* resolves a Listing's status
  * in-application or challenged -> removed or whitelisted
* `msg.sender`: any

Note:

Scenario 1. IF there IS NOT a challenge:
a. the Listing is whitelisted

Scenario 2. IF there IS a challenge:

a. if the challenger won, challenger is auto-transferred the challenge reward

b. if the applicant won, the challenge reward is added to the Listing's deposit stake, available to be withdrawn using `registry.withdraw`

---

```
  voting.requestVotingRights(uint _numTokens)
```

* transfers tokens from msg.sender -> PLCRVoting contract
* `msg.sender`: token holder with allowance > `_numTokens`

---

```
  voting.commitVote(uint _pollID, bytes32 _secretHash, uint _numTokens, uint _prevPollID)
```

* submit a secret vote
* `msg.sender`: token holder with votingRights > `_numTokens`

---

```
  voting.revealVote(uint _pollID, uint _voteOption, uint _salt)
```

* reveal a secret vote
* `msg.sender`: token holder that previously committed a vote in `_pollID`

---

```
  registry.claimVoterReward(uint _challengeID, uint _salt)
```

* lorem ipsum
* `msg.sender`: 

---

```
  voting.withdrawVotingRights(uint _numTokens)
```

* lorem ipsum
* `msg.sender`: 

---

```
  voting.rescueTokens(uint _pollID)
```

* lorem ipsum
* `msg.sender`: 

---

```
  parameterizer.startPoll(uint _voteQuorum, uint _commitDuration, uint _revealDuration)
```

* lorem ipsum
* `msg.sender`: 

---

## Calls:

```
  token.balanceOf.call(address _owner) -> BN
  token.allowance.call(address _owner, address _spender) -> BN

  registry.appWasMade.call(bytes32 _listingHash) -> Boolean
  registry.canBeWhitelisted.call(bytes32 _listingHash) -> Boolean
  registry.isWhitelisted.call(bytes32 _listingHash) -> Boolean
  registry.isExpired.call(uint _termDate) -> Boolean
  registry.listings.call(bytes32 _listingHash) -> Listing struct (Array)

  registry.challengeWinnerReward.call(uint _challengeID) -> BN
  registry.voterCanClaimReward.call(uint _challengeID, address _address) -> Boolean

  registry.challenges.call(uint _challengeID) -> Challenge struct (Array)
  registry.challengeExists.call(bytes32 _listingHash) -> Boolean
  registry.challengeCanBeResolved.call(bytes32 _listingHash) -> Boolean
  registry.voterReward.call(address _address, uint _challengeID, uint _salt)

  voting.getLockedTokens(address _voter) -> BN
  voting.getInsertPointForNumTokens(address _address, uint _numTokens) -> BN
  voting.getNumPassingTokens(address _address, uint _pollID, uint _salt) -> BN
  voting.getNumTokens(address _voter, uint _pollID) -> BN
  voting.getTotalNumberOfTokensForWinningOption(uint _pollID) -> BN
  voting.voteTokenBalance(address _voter) -> BN

  voting.hasBeenRevealed(address _voter, uint _pollID) -> Boolean
  voting.commitPeriodActive(address uint _pollID) -> Boolean
  voting.revealPeriodActive(uint _pollID) -> Boolean
  voting.isExpired(uint _terminationDate) -> Boolean
  voting.isPassed(uint _pollID) -> Boolean
  voting.pollEnded(uint _pollID) -> Boolean
  voting.pollExists(uint _pollID) -> Boolean
  voting.getCommitHash(address _voter, uint _pollID) -> bytes32

  voting.pollMap(uint _pollID) -> Poll struct (Array)
  voting.validPosition(uint _prevID, uint _nextID, address _address, uint _numTokens) -> Boolean

  parameterizer.proposals(uint _pollID) -> Poll struct (indended data change)
  parameterizer.challenges(uint _challengeID) -> Challenge struct
```

---

## Events

Particular events effectively signal changes in state. The following events are organized by the effects they have on state changes.

#### Registry

```
_Application(bytes32 listingHash, uint deposit, string data)
  -> new Listing in Application stage

_Challenge(bytes32 listingHash, uint deposit, uint pollID, string data)
  -> Application stage -> Voting stage

_NewListingWhitelisted(bytes32 listingHash)
  -> Application stage -or- Voting stage -> Registry stage

_ApplicationRemoved(bytes32 listingHash)
_ListingRemoved(bytes32 listingHash)
  -> remove Listing from view

_RewardClaimed(address voter, uint challengeID, uint reward)
_Deposit(bytes32 listingHash, uint added, uint newTotal)
_Withdrawal(bytes32 listingHash, uint withdrew, uint newTotal)
  -> adjust Listing's deposit accordingly
```

#### PLCR Voting

```
PollCreated(uint voteQuorum, uint commitDuration, uint revealDuration, uint pollID)
  -> new parameterization proposal

VoteCommitted(address voter, uint pollID, uint numTokens)
  -> increase committed numTokens for pollID

VoteRevealed(address voter, uint pollID, uint numTokens, uint choice)
  -> decrease committed numTokens for pollID
  -> increase revealed numTokens for pollID

VotingRightsGranted(address voter, uint numTokens)
VotingRightsWithdrawn(address voter, uint numTokens)
  -> user-specific
```

---

## Lifecycle of a `Listing`; General TCR Language (WIP)

Each `Listing` starts out in the **Application** stage.

* The owner of the `Listing` is called the "Applicant"
* Tokens sent by Applicant are called `application_deposit`
* `application_deposit` **>=** `min_deposit` (canonical parameter)
* The Applicant is allowed to increase the `application_deposit`

If _challenged_, a `Listing` moves into the **Voting** stage.

* The msg.sender of the _challenge_ is called the "Challenger"
* Tokens obtained from Challenger are called `challenge_stake`
* `challenge_stake` **===** `min_deposit` (canonical parameter)

The **Voting** stage consists of 2 sub-periods: _Commit_ and _Reveal_

* **Voting** can also be called **Faceoff**
* Participants _voting_ with tokens are called "Voters"
* Tokens used for _voting_ are called `voting_rights`
* Tokens are _locked_ during the `commit_period`
* Once the `commit_period` has ended and the `reveal_period` has begun, a Voter can "reveal" his secret vote to unveil the contents

If the majority of votes is FOR the Applicant's `Listing`, the `Listing` enters the **Registry** stage.

* Applicant's `application_deposit` stays with the `Listing`
* Challenger forfeits full `challenge_stake`
* Applicant receieves `%` of the Challenger's forfeited `challenge_stake`
* Voters in the `majority_bloc` are awarded the remaining tokens of the Challenger's forfeited `challenge_stake`, disbursed based on token-vote weight
* Voters in the `minority_bloc` are allowed to retreive `voting_rights`

If the majority of votes is AGAINST the `Listing`, the `Listing` is removed from the system.

* Challenger receives full `challenge_stake`
* Applicant forfeits `min_deposit` and receives `application_deposit` - `min_deposit` (extra tokens)
* Tokens that are to be forfeited by the Applicant are called `application_stake` (equal to `min_deposit`)
* Challenger receieves `%` of the Applicant's forfeited `application_stake`
* Voters in the `majority_bloc`, those who voted AGAINST the Applicant, are awarded the remaining tokens from the Applicant's forfeited `application_stake`, disbursed based on token-vote weight
* Voters in the `minority_bloc` are allowed to retreive tokens rights

---

## IPFS

InterPlanetary File System

https://medium.com/@ConsenSys/an-introduction-to-ipfs-9bba4860abd0

“When you have IPFS, you can start looking at everything else in one specific way and you realize that you can replace it all” — Juan Benet

"IPFS uses content addressing at the HTTP layer. This is the practice of saying instead of creating an identifier that addresses things by location, we’re going to address it by some representation of the content itself. This means that the content is going to determine the address. The mechanism is to take a file, hash it cryptographically so you end up with a very small and secure representation of the file which ensures that someone can not just come up with another file that has the same hash and use that as the address. The address of a file in IPFS usually starts with a hash that identifies some root object and then a path walking down. Instead of a server, you are talking to a specific object and then you are looking at a path within that object."

**EXAMPLE**:

<details>
<summary>IPFS Pseudocode example</summary>

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

</details>

---

## IPLD

**This section is research. Not required**

InterPlanetary Linked Data

"a common hash-chain format for distributed data structures" - [Juan Benet](https://www.youtube.com/watch?v=Bqs_LzBjQyk)

[specs](https://github.com/ipld/specs/tree/master/ipld)

[how does cid work? - Protocol Description](https://github.com/ipld/cid#how-does-it-work---protocol-description)

**[highlights](https://github.com/ipld/specs/tree/master/ipld#ipld):**

There are a variety of systems that use merkle-tree and hash-chain inspired datastructures (e.g. git, bittorrent, ipfs, tahoe-lafs, sfsro)

In short, IPLD is JSON documents with named merkle-links that can be traversed

### IPLD defines:

**merkle-links**: the core unit of a merkle-graph

* A link between two objects which is content-addressed with the cryptographic hash of the target object, and embedded in the source object
* A merkle-link is represented in the IPLD object model by a map containing a single key / mapped to a "link value"
* **EXAMPLE**:

<details>
<summary>Merkle Links example</summary>

```js
// A link, represented in json as a "link object"
{
  "/": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k"
}

// "/" is the link key
// "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k" is the link value

// Object with link at foo/baz
{
  "foo": {
    "bar": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k", // not a link
    "baz": {"/": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k"} // link
  }
}

// Object with pseudo 'link object' at files/cat.jpg and ACTUAL link at files/cat.jpg/link
{
  "files": {
    "cat.jpg": { // give links properties wrapping them in another object
      "link": {"/": "/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k"}, // the link
      "mode": 0755,
      "owner": "jbenet"
    }
  }
}
```

</details>

**merkle-dag**: any graphs whose edges are merkle-links. dag stands for "directed acyclic graph"

* Objects with merkle-links form a Graph (merkle-graph), which necessarily is both Directed, and which can be counted on to be Acyclic, iff the properties of the cryptographic hash function hold. I.e. a merkle-dag. Hence all graphs which use merkle-linking (merkle-graph) are necessarily also Directed Acyclic Graphs (DAGs, hence merkle-dag).

**merkle-paths**: unix-style paths for traversing merkle-dags with named merkle-links

* A merkle-path is a unix-style path (e.g. /a/b/c/d) which initially dereferences through a merkle-link and allows access of elements of the referenced node and other nodes transitively. It looks into the object, finding the name and resolving the associated merkle-link.
* General purpose filesystems are encouraged to design an object model on top of IPLD that would be specialized for file manipulation and have specific path algorithms to query this model.
* `/ipfs/QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k/a/b/c/d`
  * `ipfs` is a protocol namespace (to allow the computer to discern what to do)
  * `QmUmg7BZC1YP1ca66rRtWKxpXp77WgVHrnv263JtDuvs2k` is a cryptographic hash
  * `a/b/c/d` is a path traversal, as in unix
* Path traversals, denoted with /, happen over two kinds of links:
  * **in-object traversals** traverse data within the same object
  * **cross-object traversals** traverse from one object to another, resolving through a merkle-link

**IPLD Data Model**

* The IPLD Data Model defines a simple JSON-based structure for representing all merkle-dags, and identifies a set of formats to encode the structure into. IPLD is directly compatible with JSON

**IPLD Serialized Formats**

* a set of formats in which IPLD objects can be represented (through multicodec)
* e.g. JSON, CBOR, CSON, YAML, Protobuf, XML, RDF, etc.
* The only requirement is that there MUST be a well-defined one-to-one mapping with the IPLD Canonical format. This is so that data can be transformed from one format to another, and back, without changing its meaning nor its cryptographic hashes

**IPLD Canonical Format**

* a deterministic description on a serialized format that ensures the same logical object is always serialized to the exact same sequence of bits. This is critical for merkle-linking, and all cryptographic applications
* [more details](https://github.com/ipld/specs/tree/master/ipld#canonical-format)

**EXAMPLE:**

<details>
<summary>Datastructure examples</summary>

**Unix Filesystem**

```
{
  "data": "hello world",
  "size": "11"
}
```

**Chunked file**, split into multiple sub-files

```
{
  "size": "1424119",
  "subfiles": [
    {
      "link": {"/": "QmAAA..."},
      "size": "100324"
    },
    {
      "link": {"/": "QmAA1..."},
      "size": "120345",
      "repeat": "10"
    },
    {
      "link": {"/": "QmAA1..."},
      "size": "120345"
    },
  ]
}
```

**Directory**

```
{
  "foo": {
    "link": {"/": "QmCCC...111"},
    "mode": "0755",
    "owner": "jbenet"
  },
  "cat.jpg": {
    "link": {"/": "QmCCC...222"},
    "mode": "0644",
    "owner": "jbenet"
  },
  "doge.jpg": {
    "link": {"/": "QmCCC...333"},
    "mode": "0644",
    "owner": "jbenet"
  }
}
```

**Git blob**

```json
{
  "data": "hello world"
}
```

**Git tree**

```json
{
  "foo": {
    "link": { "/": "QmCCC...111" },
    "mode": "0755"
  },
  "cat.jpg": {
    "link": { "/": "QmCCC...222" },
    "mode": "0644"
  },
  "doge.jpg": {
    "link": { "/": "QmCCC...333" },
    "mode": "0644"
  }
}
```

**Git commit**

```json
{
  "tree": { "/": "e4647147e940e2fab134e7f3d8a40c2022cb36f3" },
  "parents": [
    { "/": "b7d3ead1d80086940409206f5bd1a7a858ab6c95" },
    { "/": "ba8fbf7bc07818fa2892bd1a302081214b452afb" }
  ],
  "author": {
    "name": "Juan Batiz-Benet",
    "email": "juan@benet.ai",
    "time": "1435398707 -0700"
  },
  "committer": {
    "name": "Juan Batiz-Benet",
    "email": "juan@benet.ai",
    "time": "1435398707 -0700"
  },
  "message":
    "Merge pull request #7 from ipfs/iprs\n\n(WIP) records + merkledag specs"
}
```

</details>

---

## Credits

UI Components

[aragon-ui](https://github.com/aragon/aragon-ui/tree/master/src/components)

[material-ui](https://material-ui-next.com/)

[semantic-ui](https://react.semantic-ui.com/)

Utils

[0x.js](https://github.com/0xProject/0x.js/tree/development/packages)

[Augur](https://github.com/AugurProject/augur/tree/seadragon/src/utils)

[MyCrypto](https://github.com/MyCryptoHQ/MyCrypto/tree/develop/common/utils)

[UDAPP](https://github.com/kumavis/udapp)

---

## Workflow diagrams

These workflow diagrams were created by our wonderful designer, Eva Shon.

![Simple overview](https://s3.amazonaws.com/elasticbeanstalk-us-east-1-167611752874/simple-overview.png)

## ![Detailed workflow](https://s3.amazonaws.com/elasticbeanstalk-us-east-1-167611752874/detailed-workflow.png)

### License

This project is licensed under the MIT license, Copyright (c) 2018 Isaac Kang. For more information see `LICENSE`.
