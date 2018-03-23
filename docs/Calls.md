## Calls

Calls do not change state

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
