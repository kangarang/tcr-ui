TCR UI (WIP)
============

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to curate and reach decentralized consensus on a list of high-quality entries (Registry)

The vision of this project is to build a registry-agnostic, highly-configurable, client-side user interface to interact and transact with Ethereum TCRs

## Articles

[Token-Curated Registries 1.0](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)

[Token-Curated Registry 1.1, 2.0](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)

## Repos

[TCR](https://github.com/skmgoldin/tcr)

[TCR (forked)](https://github.com/kangarang/tcr)

[PLCR Voting](https://github.com/ConsenSys/PLCRVoting)

[AdChain Registry](https://github.com/AdChain/AdChainRegistry)

[AdChain Registry Dapp](https://github.com/AdChain/AdChainRegistryDapp)

---

## Commands

**Run**

Start development server: `https://localhost:3000`

```
  $ npm run dev
```

---

## U D A P P

This project uses [kumavis' ethereum universal dapp](https://github.com/kumavis/udapp), refactored for react

Udapp is a higher-order component that does a few things:
- reads contract JSON ABI
- decodes methods
- exposes available endpoints

---

### TCR endpoints

#### Token:
```
Transactions:
  .approve(_spender, _value)
  .transferFrom(_from, _to, _value)
  .transfer(_to, _value)

Calls:
  .balanceOf(_owner) -> BN
  .allowance(_owner, _spender) -> BN
```

#### Registry:
```
Transactions:
// registry-related
  .apply(_listing, _amount)
  .challenge(_listing)
  .deposit(_listing, _amount)
  .withdraw(_listing, _amount)
  .exit(_listing)
  .updateStatus(_listing)

// token-related
  .claimReward(_challengeID, _salt)

// voting-related
  .calculateVoterReward(_address, _challengeID, _salt)

Calls:
// registry-related
  .appWasMade(_listing) -> Boolean
  .canBeWhitelisted(_listing) -> Boolean
  .isWhitelisted(_listingHash) -> Boolean
  .isExpired(_termDate) -> Boolean
  .listings(_listingHash) -> Listing struct (Array)

// token-related
  .determineReward(_challengeID) -> BN
  .tokenClaims(_challengeID, _address) -> BN

// voting-related
  .challenges(_challengeID) -> Challenge struct (Array)
  .challengeExists(_listing) -> Boolean
  .challengeCanBeResolved(_listing) -> Boolean
```

#### PLCR Voting
```
Transactions:
// token-related
  .requestVotingRights(_numTokens)
  .withdrawVotingRights(_numTokens)
  .rescueTokens(_pollID)

// voting-related
  .commitVote(_pollID, _secretHash, _numTokens, _prevPollID)
  .revealVote(_pollID, _voteOptions, _salt)

(parameterizer-related)
  .startPoll(_voteQuorum, _commitDuration, _revealDuration)

Calls:
// token-related
  .getLockedTokens(_voter) -> BN
  .getInsertPointForNumTokens(_address, _numTokens) -> BN
  .getNumPassingTokens(_address, _pollID, _salt) -> BN
  .getNumTokens(_voter, _pollID) -> BN
  .getTotalNumberOfTokensForWinningOption(_pollID) -> BN
  .voteTokenBalance(_voter) -> BN

// voting-related
  .attrUUID(_user, _pollID) -> bytes32
  .commitPeriodActive(_pollID) -> Boolean
  .getCommitHash(_voter, _pollID) -> bytes32
  .getLastNode(_voter) -> BN
  .hasBeenRevealed(_voter, _pollID) -> Boolean
  .isExpired(_terminationDate) -> Boolean
  .isPassed(_pollID) -> Boolean
  .pollEnded(_pollID) -> Boolean
  .pollExists(_pollID) -> Boolean
  .pollMap(_pollID) -> Poll struct (Array)
  .revealPeriodActive(_pollID) -> Boolean
  .validPosition(_prevID, _nextID, _address, _numTokens) -> Boolean
```

#### Parameterizer
```
Calls:
  - proposals(pollIDs) -> Poll struct (indended data change)
  - challenges(challengeIDs) -> Challenge struct
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

## Events

Particular events effectively signal changes in state. The following events are organized by the effects they have on state changes.

#### Registry
`_Application(bytes32 listingHash, uint deposit, string data)`

  - new Listing in Application stage

`_Challenge(bytes32 listingHash, uint deposit, uint pollID, string data)`

  - change from Application stage -> Voting stage

`_ChallengeFailed(uint challengeID)`

`_NewListingWhitelisted(bytes32 listingHash)`

  - change from Application -or- Voting stage -> Registry stage

`_ChallengeSucceeded(uint challengeID)`

`_ApplicationRemoved(bytes32 listingHash)`

`_ListingRemoved(bytes32 listingHash)`

  - delete Listing

`_RewardClaimed(address voter, uint challengeID, uint reward)`

`_Deposit(bytes32 listingHash, uint added, uint newTotal)`

`_Withdrawal(bytes32 listingHash, uint withdrew, uint newTotal)`

  - ETH/TOKEN


#### PLCR Voting
`PollCreated(uint voteQuorum, uint commitDuration, uint revealDuration, uint pollID)`

  - new voting_item (comes with _Challenge)

`VoteCommitted(address voter, uint pollID, uint numTokens)`

  - change voting_item

`VoteRevealed(address voter, uint pollID, uint numTokens, uint choice)`

  - change voting_item

`VotingRightsGranted(address voter, uint numTokens)`

`VotingRightsWithdrawn(address voter, uint numTokens)`

  - ETH/TOKEN


### Workflow diagrams

![Simple overview](./src/assets/simple-overview.png)

![Detailed workflow](./src/assets/detailed-workflow.png)

---

### License

This project is licensed under the MIT license, Copyright (c) 2018 Isaac Kang. For more information see `LICENSE`.