TCR UI WIP
==========

[Quick and easy TCR to get up and running](https://github.com/kangarang/tcr)

Token-Curated Registries are decentrally-curated lists with intrinsic economic incentives for token-holders to curate the list judiciously

---

## Commands

**Run**

Start development server: `https://localhost:3000`

  $ npm run dev

Deploy on elastic beanstalk:

  $ eb deploy

---

## Available contract endpoints

#### Globals:
- registry.listings[domainHash]
- registry.challenges[challengeID]
- registry.tokenClaims[challengeID, address]

- voting.voteTokenBalance[address]
- voting.pollMap[pollID]
- voting.store[hash]
- voting.pollNonce

#### Token functions:
- registry.claimReward(challengeID, salt)
- registry.calculateVoterReward(address, challengeID, salt)
- voting.requestVotingRights(numTokens)
- voting.withdrawVotingRights(numTokens)
- voting.rescueTokens(pollID)

#### Voting functions:
- voting.getInsertPointForNumTokens(address, numTokens)
- voting.validPosition(prevID, nextID, address, numTokens)
- voting.commitVote(pollID, secretHash, numTokens, prevPollID)
- voting.revealVote(pollID, voteOptions, salt)

#### Getter functions:
- registry.canBeWhitelisted(domain)
- registry.isWhitelisted(domain)
- registry.appWasMade(domain)
- registry.challengeExists(domain)
- registry.challengeCanBeResolved(domain)
- registry.determineReward(challengeID)
- registry.isExpired(termDate)

- voting.isPassed(pollID): proposal passed
- voting.getTotalNumberOfTokensForWinningOption(pollID): total winning votes for reward distribution purposes
- voting.pollEnded(pollID)
- voting.commitStageActive(pollID)
- voting.revealStageActive(pollID)
- voting.hasBeenRevealed(address, pollID)
- voting.pollExists(pollID)
- voting.getCommitHash(address, pollID)
- voting.getNumTokens(address, pollID)
- voting.getNumPassingTokens(address, pollID, salt): number of tokens voted for winning options
- voting.getLastNode(address)
- voting.getLockedTokens(address)
- voting.isExpired(terminationDate)
- voting.attrUUID(address, pollID)

- parameterizer.get(parameter)

Registry
  - listingMap: domainHashes -> Listing struct
  - challengeMap: challengeIDs -> Challenge struct
  - tokenClaims: challengeIDs + address -> token claim data
PLCR Voting
  - pollMap: pollID -> Poll struct
  - dllMap: address -> DLL.data
  - AttributeStore.Data (store)
Parameterizer
  - proposalMap: pollIDs -> Poll struct (indended data change)
  - challengeMap: challengeIDs -> Challenge struct

---

## Events

#### Registry
event _Application(string domain, uint deposit)

  - new registry_item

event _Challenge(string domain, uint deposit, uint pollID)

  - change -> voting_item

event _ChallengeFailed(uint challengeID)
event _NewDomainWhitelisted(string domain)

  - change -> whitelisted

event _ChallengeSucceeded(uint challengeID)
event _ApplicationRemoved(string domain)
event _ListingRemoved(string domain)

  - delete item

event _RewardClaimed(address voter, uint challengeID, uint reward)
event _Deposit(string domain, uint added, uint newTotal)
event _Withdrawal(string domain, uint withdrew, uint newTotal)

  - $$$


#### PLCR Voting
event PollCreated(uint voteQuorum, uint commitDuration, uint revealDuration, uint pollID)

  - new voting_item

event VoteCommitted(address voter, uint pollID, uint numTokens)

  - change voting_item

event VoteRevealed(address voter, uint pollID, uint numTokens, uint choice)

  - change voting_item

event VotingRightsGranted(address voter, uint numTokens)
event VotingRightsWithdrawn(address voter, uint numTokens)

  - $$$

---

### License

This project is licensed under the MIT license, Copyright (c) 2017 Isaac Kang. For more information see `LICENSE.md`.