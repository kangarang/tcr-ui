# TCR UI (WIP)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkangarang%2Ftcr-ui?ref=badge_shield)

"Token-curated registries are decentrally-curated lists with intrinsic economic incentives for token holders to curate the list's contents judiciously" - Mike Goldin

TCRs use an intrinsic token to incentivize a community to curate and reach decentralized consensus on a Registry of high-quality entries

The vision of this project is to build a registry-agnostic client-side user interface to interact and transact with Ethereum TCRs

---

## Resources

### Wiki / Docs

[Check out the Wiki for code samples, contract endpoints, events, IPFS, and more docs!](https://github.com/kangarang/tcr-ui/wiki)

### Articles

[Token-Curated Registries 1.0](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)

[Token-Curated Registry 1.1, 2.0](https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)

[Continuous Token-Curated Registries: The Infinity of Lists](https://medium.com/@simondlr/continuous-token-curated-registries-the-infinity-of-lists-69024c9eb70d)

[City Walls & Bo-Taoshi: Exploring the Power of Token-Curated Registries](https://medium.com/@simondlr/city-walls-bo-taoshi-exploring-the-power-of-token-curated-registries-588f208c17d5)

### Code

[TCR](https://github.com/skmgoldin/tcr)

[TCR (forked)](https://github.com/kangarang/tcr)

[PLCR Voting](https://github.com/ConsenSys/PLCRVoting)

[AdChain Registry](https://github.com/AdChain/AdChainRegistry)

[AdChain Registry Dapp](https://github.com/AdChain/AdChainRegistryDapp)

### Communications

[Gitter channel](https://gitter.im/Curation-Markets/Lobby)

---

## Commands

### **Local blockchain/RPC** (optional)

[ganache-cli](https://github.com/trufflesuite/ganache-cli) - `http://localhost:8545`

```
  $ npm install -g ganache-cli
  $ ganache-cli
```

### **Deploy**

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

### **Run UI**

Start development server: `http://localhost:3000`

```
  $ npm run dev
```

---

## Credits

UI Components

[aragon-ui](https://github.com/aragon/aragon-ui/tree/master/src/components)

[material-ui](https://material-ui-next.com/)

[semantic-ui](https://react.semantic-ui.com/)

Utils

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
