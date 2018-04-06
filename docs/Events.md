## Events

Particular events effectively signal changes in state. The following events are organized by the effects they have on state changes.

#### Registry

```
_Application(bytes32 indexed listingHash, uint indexed deposit, string data)
  -> new Listing in Application stage

_Challenge(bytes32 indexed listingHash, uint indexed deposit, uint indexed pollID, string data)
  -> Application stage -> Voting stage

_ChallengeFailed(uint indexed challengeID)
_NewListingWhitelisted(bytes32 indexed listingHash)
  -> Application stage -or- Voting stage -> Registry stage

_ChallengeSucceeded(uint indexed challengeID)
_ApplicationRemoved(bytes32 indexed listingHash)
_ListingRemoved(bytes32 indexed listingHash)
  -> remove Listing from view

_RewardClaimed(address indexed voter, uint indexed challengeID, uint indexed reward)
_Deposit(bytes32 indexed listingHash, uint indexed added, uint indexed newTotal)
_Withdrawal(bytes32 indexed listingHash, uint indexed withdrew, uint indexed newTotal)
  -> adjust Listing's deposit accordingly
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
