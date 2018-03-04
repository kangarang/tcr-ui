TCR UI (WIP)
============

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to curate and reach decentralized consensus on a Registry of high-quality entries

The vision of this project is to build a registry-agnostic, highly-configurable, client-side user interface to interact and transact with Ethereum TCRs

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

(Note: only have to run once. *While ganache-cli is running*)

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

## Credits

UI Components

[aragon-ui](https://github.com/aragon/aragon-ui/tree/master/src/components)

[aragon-ui/styles](https://scene.zeplin.io/project/59a827960d4c4cb2274007f5)

Utils

[0x.js](https://github.com/0xProject/0x.js/tree/development/packages)

[Augur](https://github.com/AugurProject/augur/tree/seadragon/src/utils)

[MyCrypto](https://github.com/MyCryptoHQ/MyCrypto/tree/develop/common/utils)

[UDAPP](https://github.com/kumavis/udapp)

---

### TCR endpoints

#### Token:
```
Transactions:
  .approve(address _spender, uint _value)
  .transferFrom(address _from, address _to, uint _value)
  .transfer(address _to, uint _value)

Calls:
  .balanceOf(address _owner) -> BN
  .allowance(address _owner, address _spender) -> BN
```

#### Registry:
```
Transactions:
// registry-related
  .apply(bytes32 _listingHash, uint _amount, string _data)
  .challenge(bytes32 _listingHash, string _data)
  .deposit(bytes32 _listingHash, uint _amount)
  .withdraw(bytes32 _listingHash, uint _amount)
  .exit(bytes32 _listingHash)
  .updateStatus(bytes32 _listingHash)

// token-related
  .claimVoterReward(uint _challengeID, uint _salt)

Calls:
// registry-related
  .appWasMade(bytes32 _listingHash) -> Boolean
  .canBeWhitelisted(bytes32 _listingHash) -> Boolean
  .isWhitelisted(bytes32 _listingHash) -> Boolean
  .isExpired(uint _termDate) -> Boolean
  .listings(bytes32 _listingHash) -> Listing struct (Array)

// token-related
  .challengeWinnerReward(uint _challengeID) -> BN
  .voterCanClaimReward(uint _challengeID, address _address) -> Boolean

// voting-related
  .challenges(uint _challengeID) -> Challenge struct (Array)
  .challengeExists(bytes32 _listingHash) -> Boolean
  .challengeCanBeResolved(bytes32 _listingHash) -> Boolean
  .voterReward(address _address, uint _challengeID, uint _salt)
```

#### PLCR Voting
```
Transactions:
// token-related
  .requestVotingRights(uint _numTokens)
  .withdrawVotingRights(uint _numTokens)
  .rescueTokens(uint _pollID)

// voting-related
  .commitVote(uint _pollID, bytes32 _secretHash, uint _numTokens, uint _prevPollID)
  .revealVote(uint _pollID, uint _voteOption, uint _salt)

(parameterizer-related)
  .startPoll(uint _voteQuorum, uint _commitDuration, uint _revealDuration)

Calls:
// token-related
  .getLockedTokens(address _voter) -> BN
  .getInsertPointForNumTokens(address _address, uint _numTokens) -> BN
  .getNumPassingTokens(address _address, uint _pollID, uint _salt) -> BN
  .getNumTokens(address _voter, uint _pollID) -> BN
  .getTotalNumberOfTokensForWinningOption(uint _pollID) -> BN
  .voteTokenBalance(address _voter) -> BN

// voting-related
  .hasBeenRevealed(address _voter, uint _pollID) -> Boolean
  .commitPeriodActive(address uint _pollID) -> Boolean
  .revealPeriodActive(uint _pollID) -> Boolean
  .isExpired(uint _terminationDate) -> Boolean
  .isPassed(uint _pollID) -> Boolean
  .pollEnded(uint _pollID) -> Boolean
  .pollExists(uint _pollID) -> Boolean
  .getCommitHash(address _voter, uint _pollID) -> bytes32

  .pollMap(uint _pollID) -> Poll struct (Array)
  .getLastNode(address _voter) -> BN
  .validPosition(uint _prevID, uint _nextID, address _address, uint _numTokens) -> Boolean

  .attrUUID(address _user, uint _pollID) -> bytes32
```

#### Parameterizer
```
Calls:
  .proposals(uint _pollID) -> Poll struct (indended data change)
  .challenges(uint _challengeID) -> Challenge struct
```

---

## Events

Particular events effectively signal changes in state. The following events are organized by the effects they have on state changes.

#### Registry
```
_Application(bytes32 listingHash, uint deposit, string data)
  -> new Listing in Application stage

_Challenge(bytes32 listingHash, uint deposit, uint pollID, string data)
  -> change from Application stage -> Voting stage

_ChallengeFailed(uint challengeID)
_NewListingWhitelisted(bytes32 listingHash)
  -> change from Application -or- Voting stage -> Registry stage

_ChallengeSucceeded(uint challengeID)
_ApplicationRemoved(bytes32 listingHash)
_ListingRemoved(bytes32 listingHash)
  -> delete Listing

_RewardClaimed(address voter, uint challengeID, uint reward)
_Deposit(bytes32 listingHash, uint added, uint newTotal)
_Withdrawal(bytes32 listingHash, uint withdrew, uint newTotal)
  -> ETH/TOKEN-related
```

#### PLCR Voting
```
PollCreated(uint voteQuorum, uint commitDuration, uint revealDuration, uint pollID)
  -> new voting_item (comes with _Challenge)

VoteCommitted(address voter, uint pollID, uint numTokens)
  -> change voting_item

VoteRevealed(address voter, uint pollID, uint numTokens, uint choice)
  -> change voting_item

VotingRightsGranted(address voter, uint numTokens)
VotingRightsWithdrawn(address voter, uint numTokens)
  -> ETH/TOKEN-related
```

---

## Lifecycle of a `Listing`; General TCR Language (WIP)

Each `Listing` starts out in the **Application** stage.
- The owner of the `Listing` is called the "Applicant"
- Tokens sent by Applicant are called `application_deposit`
- `application_deposit` **>=** `min_deposit` (canonical parameter)
- The Applicant is allowed to increase the `application_deposit`

If *challenged*, a `Listing` moves into the **Voting** stage.
- The msg.sender of the *challenge* is called the "Challenger"
- Tokens obtained from Challenger are called `challenge_stake`
- `challenge_stake` **===** `min_deposit` (canonical parameter)

The **Voting** stage consists of 2 sub-periods: *Commit* and *Reveal*
- **Voting** can also be called **Faceoff**
- Participants *voting* with tokens are called "Voters"
- Tokens used for *voting* are called `voting_rights`
- Tokens are *locked* during the `commit_period`
- Once the `commit_period` has ended and the `reveal_period` has begun, a Voter can "reveal" his secret vote to unveil the contents

If the majority of votes is FOR the Applicant's `Listing`, the `Listing` enters the **Registry** stage.
- Applicant's `application_deposit` stays with the `Listing`
- Challenger forfeits full `challenge_stake`
- Applicant receieves `%` of the Challenger's forfeited `challenge_stake`
- Voters in the `majority_bloc` are awarded the remaining tokens of the Challenger's forfeited `challenge_stake`, disbursed based on token-vote weight
- Voters in the `minority_bloc` are allowed to retreive `voting_rights`

If the majority of votes is AGAINST the `Listing`, the `Listing` is removed from the system.
- Challenger receives full `challenge_stake`
- Applicant forfeits `min_deposit` and receives `application_deposit` - `min_deposit` (extra tokens)
- Tokens that are to be forfeited by the Applicant are called `application_stake` (equal to `min_deposit`)
- Challenger receieves `%` of the Applicant's forfeited `application_stake`
- Voters in the `majority_bloc`, those who voted AGAINST the Applicant, are awarded the remaining tokens from the Applicant's forfeited `application_stake`, disbursed based on token-vote weight
- Voters in the `minority_bloc` are allowed to retreive tokens rights

---

## Workflow diagrams

These workflow diagrams were created by our wonderful designer, Eva Shon.

![Simple overview](./src/assets/simple-overview.png)

![Detailed workflow](./src/assets/detailed-workflow.png)

---

### License

This project is licensed under the MIT license, Copyright (c) 2018 Isaac Kang. For more information see `LICENSE`.