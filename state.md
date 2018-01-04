## State

```js
State = {
  ethjs: Object,
  ethereumProvider: MM,
  userData: {
    address,
    network,
    balance
    allowance,
    votingRights,
    tokenClaims
  }
  contracts: {
    registry,
    token: {
      address,
      name,
      decimals,
      symbol,
      balance,
      totalSupply,
    },
    voting: {
      address,
      voteTokenBalance(voting rights),
      pVoteTokenBalance(parameterizer voting rights)
    },
    parameterizer: {
      address,
      minDeposit,
      pMinDeposit,
      applyStageLen,
      pApplyStageLen,
      commitStageLen,
      pCommitStageLen,
      revealStageLen,
      pRevealStageLen,
      dispensationPct,
      pDispensationPct,
      voteQuorum,
      pVoteQuorum,
      PROCESSBY (7 days)
    }
  },
  registry_items: [{
    domain: string
    owner: string
    appExpiry: <BN>
    unstakedDeposit: <BN>
    challengeID: false || pollNonce (announced via Events)
    whitelisted: boolean
  }],
  parameterItems: [{
    name: string
    owner: string
    appExpiry: <BN>
    unstakedDeposit: <BN>
    challengeID: false || pollNonce (announced via Events)
    processBy: <BN>
    value: <BN>
  }],
  votingItems: [{
    rewardPool: <BN> || 0
    challenger: string address of challenger
    resolved: boolean
    stake: <BN> || 0
    totalTokens: <BN> || 0?

    pollNonce: <BN>
    commitEndDate: <BN>
    revealEndDate: <BN>
    voteQuorum: <BN>
    votesFor: <BN> || false
    votesAgainst: <BN> || false
  }],
}
```

### Pre
1. Check appExpiry (only pull _Applications from blocks that matter)

### registry_items 1
1. _Application
  1. check
  2. isWhitelisted
  3. canBeWhitelisted

### voting_items 1
1. PollCreated
1. _Challenge
2. VoteCommitted

x. _ChallengeSucceeded
### voting_items 2
1. VoteRevealed

x. _ApplicationRemoved
x. _ListingRemoved
X. _ChallengeSucceeded
### registry_items 2
1. _NewDomainWhitelisted
1. _ChallengeFailed
