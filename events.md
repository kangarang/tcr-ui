## Events

#### Registry
event _Application(string domain, uint deposit);
    * +ri
event _Challenge(string domain, uint deposit, uint pollID);
    * ri -> vi
event _ChallengeFailed(uint challengeID);
event _NewDomainWhitelisted(string domain);
    * vi -> ri
event _ChallengeSucceeded(uint challengeID);
event _ApplicationRemoved(string domain);
event _ListingRemoved(string domain);
    * -ri
event _RewardClaimed(address voter, uint challengeID, uint reward);
event _Deposit(string domain, uint added, uint newTotal);
event _Withdrawal(string domain, uint withdrew, uint newTotal);
    * $$$


#### PLCR Voting
event PollCreated(uint voteQuorum, uint commitDuration, uint revealDuration, uint pollID);
    * +vi
event VoteCommitted(address voter, uint pollID, uint numTokens);
    * $$$
event VoteRevealed(address voter, uint pollID, uint numTokens, uint choice);
    * -vi
event VotingRightsGranted(address voter, uint numTokens);
event VotingRightsWithdrawn(address voter, uint numTokens);
    * $$$