## Events

Particular events effectively signal changes in state. The following events are organized by the effects they have on state changes.

#### Registry

```
event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);

  -> new Listing in Application stage

event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);

  -> Application stage -> Voting stage

event _Deposit(bytes32 indexed listingHash, uint added, uint newTotal, address indexed owner);
event _Withdrawal(bytes32 indexed listingHash, uint withdrew, uint newTotal, address indexed owner);
event _RewardClaimed(uint indexed challengeID, uint reward, address indexed voter);

  -> adjust Listing's deposit accordingly

event _ApplicationWhitelisted(bytes32 indexed listingHash);
event _ChallengeFailed(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);

  -> Application stage -or- Voting stage -> Registry stage

event _ApplicationRemoved(bytes32 indexed listingHash);
event _ListingRemoved(bytes32 indexed listingHash);
event _ListingWithdrawn(bytes32 indexed listingHash);
event _TouchAndRemoved(bytes32 indexed listingHash);
event _ChallengeSucceeded(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens);

  -> remove Listing from view


event _VoteCommitted(uint indexed pollID, uint numTokens, address indexed voter);
event _VoteRevealed(uint indexed pollID, uint numTokens, uint votesFor, uint votesAgainst, uint indexed choice, address indexed voter);
event _PollCreated(uint voteQuorum, uint commitEndDate, uint revealEndDate, uint indexed pollID, address indexed creator);

event _VotingRightsGranted(uint numTokens, address indexed voter);
event _VotingRightsWithdrawn(uint numTokens, address indexed voter);
event _TokensRescued(uint indexed pollID, address indexed voter);
```

#### PLCR Voting

```
PollCreated(uint indexed voteQuorum, uint indexed commitDuration, uint revealDuration, uint indexed pollID)
  -> new parameterization proposal

VoteCommitted(address indexed voter, uint indexed pollID, uint indexed numTokens)
  -> increase committed numTokens for pollID

VoteRevealed(address indexed voter, uint indexed pollID, uint indexed numTokens, uint choice)
  -> decrease committed numTokens for pollID
  -> increase revealed numTokens for pollID

VotingRightsGranted(address indexed voter, uint indexed numTokens)
VotingRightsWithdrawn(address indexed voter, uint indexed numTokens)
  -> user-specific
```
