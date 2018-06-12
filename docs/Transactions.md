## Transactions

Transactions change state & require signing

### In generally chronologic order..

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

Scenario 1. IF there IS NOT a challenge

* the Listing is whitelisted

Scenario 2. IF there IS a challenge:

* a. if the challenger won, challenger is auto-transferred the challenge reward
* b. if the applicant won, the challenge reward is added to the Listing's deposit stake, available to be withdrawn using `registry.withdraw`

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

---

```
  voting.withdrawVotingRights(uint _numTokens)
```

---

```
  voting.rescueTokens(uint _pollID)
```
