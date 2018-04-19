# TCR UI (WIP)

<!-- license -->

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui?ref=badge_shield)

<!-- travis-ci -->

[![Build Status](https://travis-ci.org/kangarang/tcr-ui.svg?branch=master)](https://travis-ci.org/kangarang/tcr-ui)

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to curate and reach decentralized consensus on a Registry of high-quality entries

---

## Commands / Run

### **Development**

Run app in dev mode in browser, rebuild on file changes

```
  $ npm run dev
```

### **Build**

Build production server app

```
$ npm run build
```

### **Tests**

Run unit tests with Jest

```
  $ npm test
```

### **Local blockchain/RPC** (optional)

[ganache-cli](https://github.com/trufflesuite/ganache-cli) - `http://localhost:8545`

```
  $ npm install -g ganache-cli
  $ ganache-cli
```

### **Deploy** (optional)

Clone contracts:

```
  $ git clone git@github.com:kangarang/tcr.git
  $ cd tcr
  $ npm install
```

Build JSON ABI artifacts:

(Note: only have to run once. _While ganache-cli is running_)

```
  $ npm run install && npm run compile
```

Deploy contracts to local RPC:

```
  $ npm run deploy-ganache
```

Deploy contracts to Rinkeby Test Network:

```
  $ npm run deploy-rinkeby
```

Deploy contracts to Main Network:

```
  $ npm run deploy-mainnet
```

---

## Directory structure

[ducks](https://github.com/erikras/ducks-modular-redux)

[re-ducks](https://medium.freecodecamp.org/scaling-your-redux-app-with-ducks-6115955638be)

```
│
├── docs - Documentation
|── public - Files that don't get compiled, just moved to build
|   └── index.html - Html template file
├── src
|   ├── state - Redux
|   |   ├── ducks - Redux entities
|   |   |   ├── [Duck] - Single redux entity
|   |   |   |   ├── sagas - Asynchronous side-effects
|   |   |   |   ├── tests - Jest unit tests
|   |   |   |   ├── actions.js - Action creators / plain objects
|   |   |   |   ├── index.js - Duck root import / export
|   |   |   |   ├── reducers.js - Pure functions / immutable.js
|   |   |   |   ├── selectors.js - State selectors / reselect.js
|   |   |   |   └── types.js - Action types / string constants
|   |   |   ├── index.js - Ducks root
|   |   |   └── reducers - Reducer combiner
|   │   ├── libs - Framework-agnostic libraries
|   |   ├── utils - Common utility helper functions
|   |   └── store.js - Redux reducer and middleware injector
|   ├── views - React
|   |   ├── assets - Images, fonts, etc.
|   |   ├── components - Stateless, dumb components
|   |   ├── containers - Stateful, smart containers
|   |   ├── translations - Language JSON dictionaries
|   |   ├── App.js - Root React component
|   |   └── global-styles.js - Theme / colors
|   └── index.js - Entry point for app
└── server.js - Express.js app
```

---

## Docs

**State Changes**

* [Lifecycle of a Listing](./docs/Lifecycle-of-a-Listing.md)
* [Events](./docs/Events.md)

**TCR Endpoints**

* [Transactions](./docs/Transactions.md)
* [Calls](./docs/Calls.md)

**InterPlanetary Shenanigans**

* [IPFS](./docs/IPFS.md)
* [IPLD](./docs/IPLD.md)

---

## Resources

**Articles**

* [Token-Curated Registries 1.0](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)
* [Token-Curated Registry 1.1, 2.0](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)
* [Continuous Token-Curated Registries: The Infinity of Lists](https://medium.com/@simondlr/continuous-token-curated-registries-the-infinity-of-lists-69024c9eb70d)
* [City Walls & Bo-Taoshi: Exploring the Power of Token-Curated Registries](https://medium.com/@simondlr/city-walls-bo-taoshi-exploring-the-power-of-token-curated-registries-588f208c17d5)

**Code**

* [TCR](https://github.com/skmgoldin/tcr)
* [PLCR Voting](https://github.com/ConsenSys/PLCRVoting)
* [AdChain Registry](https://github.com/AdChain/AdChainRegistry)
* [AdChain Registry Dapp](https://github.com/AdChain/AdChainRegistryDapp)
* [DAppDev/EasyTCR](https://github.com/DAppDevConsulting/EasyTCR)

**Community**

* [Gitter channel](https://gitter.im/Curation-Markets/Lobby)
* [tokencuratedregistry.com](https://medium.com/@tokencuratedregistry)

---

## Acknowledgements

[Aragon-ui](https://github.com/aragon/aragon-ui/tree/master/src/components)

[0x.js](https://github.com/0xProject/0x.js/tree/development/packages)

[Augur](https://github.com/AugurProject/augur/tree/seadragon/src/utils)

[MyCrypto](https://github.com/MyCryptoHQ/MyCrypto/tree/develop/common/utils)

[UDAPP](https://github.com/kumavis/udapp)

---

## Workflow diagrams

These workflow diagrams were created by our wonderful designer, Eva Shon

![Simple overview](https://s3.amazonaws.com/elasticbeanstalk-us-east-1-167611752874/simple-overview.png)

## ![Detailed workflow](https://s3.amazonaws.com/elasticbeanstalk-us-east-1-167611752874/detailed-workflow.png)

---

### License

This project is licensed under the MIT license, Copyright (c) 2018 Isaac Kang. For more information see `LICENSE`.
