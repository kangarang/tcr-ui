# TCR UI (WIP)

<!-- license -->

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui?ref=badge_shield)

<!-- travis-ci -->

[![Build Status](https://travis-ci.org/kangarang/tcr-ui.svg?branch=master)](https://travis-ci.org/kangarang/tcr-ui)

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to reach decentralized consensus and curate a registry of high-quality entries

---

## Getting started

### _NOTICE_: commands prefixed with **`$`** should be executed in this repo, while commands prefixed with **`>`** should be executed in a **separate shell**, in a cloned [tcr](https://github.com/kangarang/tcr) repo

**TCR-UI**:

Clone & run app in dev mode in browser, rebuild on file changes - `localhost:3000`

```
  $ git clone https://github.com/kangarang/tcr-ui.git
  $ cd tcr-ui
  $ npm install
  $ npm run dev
```

**Tests**

Run unit tests with Jest

```
  $ npm test
```

**Local blockchain/RPC (optional)**:

[ganache-cli](https://github.com/trufflesuite/ganache-cli) - `localhost:8545`

```
  $ npm run rpc
```

Warning: Do not use the mnemonic associated with this command on ethereum main network. [You will lose your funds!](https://www.reddit.com/r/ethereum/comments/7z4n6a/people_are_using_the_hardcoded_ganache_seedphrase/)

**TCR (optional)**:

Clone & install/compile smart contracts

```
  > git clone https://github.com/kangarang/tcr.git
  > cd tcr
  > npm install
  > npm run compile
```

**Deploy contracts (optional)**:

local test network

```
  > npm run deploy-ganache
```

rinkeby test network

```
  > npm run deploy-rinkeby
```

---

## Application Binary Interfaces

tcr-ui retrieves ABIs from IPFS, then loads the tcr smart contracts using the current `networkID` of MetaMask. the ABIs retrieved from IPFS are the same ABIs as the ones located in [/scripts/abis/](https://github.com/kangarang/tcr-ui/tree/master/scripts/abis)

The registry MUST be deployed to a network. If you have a registry address that you want to force, hardcode it in [/src/config/registry.json](../src/config/registry.json)

If you do not want to rely on hardcoding the address, you can add a custom set of ABIs to IPFS:

1.  Edit the `"address"` of the appropriate `"networks"` section of [/scripts/abis/Registry.json](../scripts/abis/Registry.json)
1.  Run `npm run update:abis` to add your custom abis to IPFS. (note: a multihash starting with "Qm" will be printed)
1.  Update the `ipfsABIsHash` variable in [/src/redux/libs/ipfs.js](../src/redux/libs/ipfs.js) to the IPFS multihash

[more info](./docs/IPFS.md)

---

## Directory structure

```
|
├── docs - Documentation
├── public - Files that don't get compiled, just moved to build
|  └── index.html - Html template file
├── scripts
|  └── abis - TCR contract JSON ABIs
├── src
|  ├── config - Config data
|  ├── redux - Redux-related
|  |  ├── libs - Framework-agnostic libraries
|  |  ├── modules - Redux modules
|  |  |  ├── [module] - Single Redux module
|  |  |  |  ├── sagas - Asynchronous side-effects
|  |  |  |  ├── tests - Jest unit tests
|  |  |  |  ├── actions.js - Action creators / plain objects
|  |  |  |  ├── index.js - Duck root import / export
|  |  |  |  ├── reducers.js - Pure functions / immutable.js
|  |  |  |  ├── selectors.js - State selectors / reselect.js
|  |  |  |  ├── types.js - Action types / string constants
|  |  |  |  └── utils.js - Module-specific helpers
|  |  |  ├── index.js - Ducks root
|  |  |  └── reducers - Reducer combiner
|  |  ├── utils - Common utility helper functions
|  |  ├── store.js - Redux reducer and middleware injector
|  ├── views - React
|  |  ├── assets - Images, fonts, etc.
|  |  ├── components - Stateless, dumb components
|  |  ├── containers - Stateful, smart containers
|  |  ├── translations - Language JSON dictionaries
|  |  ├── App.js - Root React component
|  |  └── global-styles.js - Theme / colors
|  └── index.js - Entry point for app
└── server.js - Express.js app
```

---

## Docs

* [Events](./docs/Events.md)
* [Transactions](./docs/Transactions.md)
* [IPFS](./docs/IPFS.md)

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
