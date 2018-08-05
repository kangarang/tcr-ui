# TCR UI (WIP)

<!-- license -->

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui?ref=badge_shield)

<!-- travis-ci -->

[![Build Status](https://travis-ci.org/kangarang/tcr-ui.svg?branch=master)](https://travis-ci.org/kangarang/tcr-ui)

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to reach decentralized consensus and curate a registry of high-quality entries

<!-- the ethereum blockchain is a decentralized database

ethereum miners are decentralized servers

token-curated registries are decentralized lists

a tcr is powered by its users

a user can participate in a tcr's application, challenge, and voting processes

a tcr has 1 permission: its intrinsic token

if a user controls a balance of a tcr's token, that user can participate in that tcr

if Alice has adToken, she can participate in the adChain registry

if a user controls multiple tokens from multiple tcrs, the user can participate in multiple tcrs

if Bob has SUN, FOAM, and CVL, he can participate in the Sunset, FOAM, and Civil registries -->

---

## Requirements

* Node >= 8.0.0
* Yarn >= 1.7.0\*

<sub>*npm is not supported for package management. tcr-ui uses yarn.lock to ensure sub-dependency versions are pinned. yarn is required to install node_modules</sub>

## Getting started

### _NOTICE_:

1. This repo currently defaults to supporting the contracts compiled from [this forked repo](https://github.com/kangarang/tcr). The differences include: 1 additional string argument to both: the `apply` function and the `_Application` event emission. This means the event signature of an `_Application` event will ultimately be different, as the tightly-packed types are different. [more details](https://github.com/kangarang/tcr-ui/issues/107#issuecomment-410531118)

1. Commands prefixed with **`$`** should be executed in this repo, while commands prefixed with **`>`** should be executed in a **separate shell**, in a cloned [tcr](https://github.com/kangarang/tcr) repo

**TCR-UI**:

Clone & run app in dev mode in browser, rebuild on file changes - `localhost:3000`

```
  $ git clone https://github.com/kangarang/tcr-ui.git
  $ cd tcr-ui
  $ yarn
  $ yarn start
```

**Tests**

Run unit tests with Jest

```
  $ yarn test
```

**Local blockchain/RPC (optional)**:

[ganache-cli](https://github.com/trufflesuite/ganache-cli) - `localhost:8545`

Warning: Do not use the mnemonic associated with this command on ethereum main network. [You will lose your funds!](https://www.reddit.com/r/ethereum/comments/7z4n6a/people_are_using_the_hardcoded_ganache_seedphrase/)

```
  # start local blockchain and rpc server
  $ yarn run rpc
```

**TCR (optional)**:

```
  # clone tcr smart contracts
  > git clone https://github.com/kangarang/tcr.git
  > cd tcr

  # install node dependencies and ethpm dependencies
  > npm install

  # compile smart contracts
  > npm run compile
```

**Deploy contracts (optional)**:

```
  # migrate contracts to local test network (port: 8545)
  > npm run deploy-ganache
```

```
  # migrate contracts to rinkeby test network (network_id: 4)
  > npm run deploy-rinkeby
```

---

## Deployed TCRs

The [Sunset Registry](https://sunset-registry.firebaseapp.com/) is deployed on the Rinkeby test network

The [adChain Registry](https://publisher.adchain.com/) for publishers is deployed on Ethereum main network

---

## Application Binary Interfaces

tcr-ui retrieves ABIs from IPFS, then loads the tcr smart contracts using the current `networkID` of MetaMask. the ABIs retrieved from IPFS are the same ABIs as the ones located in [/scripts/abis/](./scripts/abis/)

The registry MUST be deployed to a network. If you have a registry address that you want to force, hardcode it in [/src/config](./src/config/index.js)

If you do not want to rely on hardcoding the address, you can add a custom set of ABIs to IPFS:

1.  Edit the `"address"` of the appropriate `"networks"` section of [/scripts/abis/Registry.json](./scripts/abis/Registry.json)
1.  Run `npm run update:abis` to add your custom abis to IPFS. (note: a multihash starting with "Qm" will be printed)
1.  Update the `ipfsABIsHash` variable in [/src/config](./src/config/index.js) to the IPFS multihash

[more info](./docs/IPFS.md)

---

## Directory structure

```
|
├── design - Wireframes
├── docs - Documentation
├── public - Files that don't get compiled, just moved to build
|  └── index.html - Html template file
├── scripts
|  └── abis - TCR contract JSON ABIs
├── src
|  ├── api - Fetch data
|  ├── assets - Images, fonts, etc.
|  ├── components - Stateless, dumb components
|  ├── config - Config data
|  ├── containers - Stateful, smart containers
|  ├── libs - Framework-agnostic libraries
|  ├── modules - Redux modules
|  |  ├── [module] - Single Redux module
|  |  |  ├── sagas - Asynchronous side-effects
|  |  |  ├── tests - Jest unit tests
|  |  |  ├── actions.js - Action creators / plain objects
|  |  |  ├── index.js - Module root import / export
|  |  |  ├── reducers.js - Pure functions / immutable.js
|  |  |  ├── selectors.js - State selectors / reselect.js
|  |  |  ├── types.js - Action types / string constants
|  |  |  └── utils.js - Module-specific helpers
|  |  └── reducers - Reducer combiner
|  ├── stories - Storybook
|  ├── translations - Language JSON dictionaries
|  ├── utils - Common utility helper functions
|  ├── App.js - Root React component
|  ├── global-styles.js - Theme / colors
|  ├── index.js - Entry point for app
|  └── store.js - Redux reducer and middleware injector
|
```

---

## Docs

- [Events](./docs/Events.md)
- [Transactions](./docs/Transactions.md)
- [IPFS](./docs/IPFS.md)

[Wireframes](./design/)

---

## Resources

**Articles**

- [Token-Curated Registries 1.0](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)
- [Token-Curated Registry 1.1, 2.0](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)
- [Continuous Token-Curated Registries: The Infinity of Lists](https://medium.com/@simondlr/continuous-token-curated-registries-the-infinity-of-lists-69024c9eb70d)
- [City Walls & Bo-Taoshi: Exploring the Power of Token-Curated Registries](https://medium.com/@simondlr/city-walls-bo-taoshi-exploring-the-power-of-token-curated-registries-588f208c17d5)

**Code**

- [TCR](https://github.com/skmgoldin/tcr)
- [PLCR Voting](https://github.com/ConsenSys/PLCRVoting)
- [AdChain Registry](https://github.com/AdChain/AdChainRegistry)
- [AdChain Registry Dapp](https://github.com/AdChain/AdChainRegistryDapp)
- [DAppDev/EasyTCR](https://github.com/DAppDevConsulting/EasyTCR)

**Community**

- [Gitter channel](https://gitter.im/Curation-Markets/Lobby)
- [tokencuratedregistry.com](https://medium.com/@tokencuratedregistry)

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
