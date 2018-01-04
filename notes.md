TCR UI WIP
==========

Category | Tool
--- | ---
UI / State management | React, Redux, Immutable, React-router, Reselect
Async / API / side-effects | Redux-saga
Bundling / transpiling | Webpack, Babel
Typing, linting | TypeScript?, TSLint?, ESLint
Testing | Jest
Styling | Styled-components, SASS
Ethereum | Ethjs, Ethereumjs, Ethers.js, Truffle, Infura, Ganache
Wallet | MetaMask, Vynos (spankchain's iframe wallet), Hardware wallet support

---

## To do
- Uniform style guide
- UI / UX flow - contract interactions / auto-transactions
- Copy writing - user instructions and game strategy
- User data / persistent accounts
- Translations / other intl.
- Caching
- Security
- Testing
- Implement TypeScript / TSLint
- Offline txns
- Full node users: fast way to utilize their full node?

---

## [State](./state.md)

---

Winning a challenge should automatically call updateStatus and claimReward

Programmable transactions (timed, type, factors - site stats, user, stake)

---

## Available contract abstraction API endpoints

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

- parameterizer.get(param)

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


### collections vs transformations
#### filter vs map

#### Rewrite map and filter
```js
const map = (xf, array) => {
  return array.reduce((acc, val) => {
    acc.push(xf(val));
    return acc;
  }, []);
}

map(doubleTheNumber, [1,2,3,4]);
// [2, 4, 6, 8]

const filter = (predicate, array) => {
  return array.reduce((acc, val) => {
    if (predicate(val)) acc.push(val);
    return acc;
  }, []);
}

filter(evensOnly, [1,2,3,4]);
// [2, 4]
```

#### Map and filter transducers
```js
const map = (xf) => {
  return (acc, val) => {
    acc.push(xf(val));
    return acc;
  }
}

const filter = (predicate) => {
  return (acc, val) => {
    if (predicate(val)) acc.push(val);
    return acc;
  }
}

// These are decorators. You call them once, and you get back a reducer

[1,2,3,4]
  .reduce(filter(evenOnly), [])
  .reduce(map(doubleTheNumber), []);
  // [4, 8]


const filterThatDoubles = (predicate) => {
  return (acc, val) => { // outer reducer
    if (predicate(val)) return map(doubleTheNumber)(acc, val); // inner reducer
    return acc;
  }
}

[1,2,3,4]
  .reduce(filterThatDoubles(evenOnly), []);
  // [4, 8]

                    // This is a function that takes a reducer as an argument, and returns a reducer.
                    // This is a transducer
const filter = (predicate) => (reducer) => {
  return (acc, val) => {
    if (predicate(val)) return reducer(acc, val); // inner reducer
    return acc;
  }
}

[1,2,3,4]
  .reduce(filter(evenOnly)(map(doubleTheNumber)), []);
  // [4, 8]
  // filter takes
  // a predicate: determines the logic for how you want to filter
  // and an inner reducer, which decides how the value should interact with the accumulation

const isEvenFilter = filter(evenOnly);
const isNot2Filter = filter(val => val !== 2);

const doubleMap = map(doubleTheNumber);

[1,2,3,4].reduce(isNot2Filter(isEvenFilter(doubleMap)), []);
// [4, 8]
// Composition is producing the values we expect

const map = (xf) => reducer => {
  return (acc, val) => {
    reducer(acc, xf(value));
    return acc;
  }
}

const pushReducer = (acc, value) => {
  acc.push(value);
  return acc;
};

[1,2,3,4].reduce(isNot2Filter(isEvenFilter(doubleMap(pushReducer))), []);
// [8]
// inner reducers inside other reducers
```
