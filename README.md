TCR UI
======

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

Articles

[Token-Curated Registries 1.0](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)

[Token-Curated Registry 1.1, 2.0](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)

Repos

[TCR](https://github.com/skmgoldin/tcr)

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

Deploy to aws elastic beanstalk:

```
  $ eb deploy
```

---

## U D A P P

[ethereum universal dapp](https://github.com/kumavis/udapp) refactored for react

Udapp is a higher-order component that does a few things:
- reads contract JSON ABI
- decodes methods
- exposes available endpoints




#### Globals:
- registry
  .listings[listingHash]
  .challenges[challengeID]

- voting
  .voteTokenBalance[address]
  .pollMap[pollID]
  .store[hash]
  .pollNonce

#### Token functions:
- registry
  .claimReward(challengeID, salt)
  .calculateVoterReward(address, challengeID, salt)

- voting
  .requestVotingRights(numTokens)
  .withdrawVotingRights(numTokens)
  .rescueTokens(pollID)

#### Voting functions:
- voting
  .getInsertPointForNumTokens(address, numTokens)
  .validPosition(prevID, nextID, address, numTokens)
  .commitVote(pollID, secretHash, numTokens, prevPollID)
  .revealVote(pollID, voteOptions, salt)

#### Getter functions:
- registry
  .canBeWhitelisted(listingHash)
  .tokenClaims[challengeID, address]
  .isWhitelisted(listingHash)
  .appWasMade(listingHash)
  .challengeExists(listingHash)
  .challengeCanBeResolved(listingHash)
  .determineReward(challengeID)
  .isExpired(termDate)

- voting
  .isPassed(pollID): proposal passed
  .getTotalNumberOfTokensForWinningOption(pollID): total winning votes for reward distribution purposes
  .pollEnded(pollID)
  .commitStageActive(pollID)
  .revealStageActive(pollID)
  .hasBeenRevealed(address, pollID)
  .pollExists(pollID)
  .getCommitHash(address, pollID)
  .getNumTokens(address, pollID)
  .getNumPassingTokens(address, pollID, salt): number of tokens voted for winning options
  .getLastNode(address)
  .getLockedTokens(address)
  .isExpired(terminationDate)
  .attrUUID(address, pollID)

- parameterizer
  .get(parameter)

Registry
  - listingMap: (listingHashes) -> Listing struct
  - challengeMap: (challengeIDs) -> Challenge struct
  - tokenClaims: (challengeIDs, address) -> token claim data
PLCR Voting
  - pollMap: (pollID) -> Poll struct
  - dllMap: (address) -> DLL.data
  - AttributeStore.Data (store)
Parameterizer
  - proposalMap: (pollIDs) -> Poll struct (indended data change)
  - challengeMap: (challengeIDs) -> Challenge struct

---

## Lifecycle of a `Listing`

Each `Listing` starts out in the **Application** stage.
- The owner of the `Listing` is called the "Applicant"
- Tokens are called `deposit_stake`

If *challenged* a `Listing` moves into the **Voting** stage.
- The msg.sender of the *challenge* is called the "Challenger"
- Tokens are called `challenge_stake`

The **Voting** stage consists of 2 sub-phases: *Commit* and *Reveal*
- **Voting** can also be called **Faceoff**
- Participants voting with token rights are called "Voters"
- Tokens are called `voting_rights`

If the majority of votes is FOR the Applicant's `Listing`, the `Listing` enters the **Registry** stage.
- Applicant's `deposit_stake` stays with the `Listing`
- Challenger forfeits full `challenge_stake`
- Applicant receieves `%` of the Challenger's forfeited `challenge_stake`
- Voters in the `majority_bloc` are awarded the remaining tokens of the Challenger's forfeited `challenge_stake`, disbursed based on token-vote weight
- Voters in the `minority_bloc` are allowed to retreive `voting_rights`

If the majority of votes is AGAINST the `Listing`, the `Listing` is removed from the system.
- Challenger is given back their full `challenge_stake`
- Applicant forfeits full `deposit_stake`
- Challenger receieves `%` of the Applicant's forfeited `deposit_stake`
- Voters in the `majority_bloc`, those who voted AGAINST the Applicant, are awarded the remaining tokens from the Applicant's forfeited `deposit_stake`, disbursed based on token-vote weight
- Voters in the `minority_bloc` are allowed to retreive tokens rights

---

## Events

#### Registry
`event _Application(bytes32 listing, uint deposit)`

  - new Listing in Application stage

`_Challenge(bytes32 listing, uint deposit, uint pollID)`

  - change from Application stage -> Voting stage

`event _ChallengeFailed(uint challengeID)`

`event _NewListingWhitelisted(bytes32 listing)`

  - change from Application -or- Voting stage -> Registry stage

`event _ChallengeSucceeded(uint challengeID)`

`event _ApplicationRemoved(bytes32 listing)`

`event _ListingRemoved(bytes32 listing)`

  - delete Listing

`event _RewardClaimed(address voter, uint challengeID, uint reward)`

`event _Deposit(bytes32 listing, uint added, uint newTotal)`

`event _Withdrawal(bytes32 listing, uint withdrew, uint newTotal)`

  - $$$


#### PLCR Voting
`event PollCreated(uint voteQuorum, uint commitDuration, uint revealDuration, uint pollID)`

  - new voting_item (comes with _Challenge)

`event VoteCommitted(address voter, uint pollID, uint numTokens)`

  - change voting_item

`event VoteRevealed(address voter, uint pollID, uint numTokens, uint choice)`

  - change voting_item

`event VotingRightsGranted(address voter, uint numTokens)`

`event VotingRightsWithdrawn(address voter, uint numTokens)`

  - $$$

---

### License

This project is licensed under the MIT license, Copyright (c) 2018 Isaac Kang. For more information see `LICENSE`.