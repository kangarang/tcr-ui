```js
const reactState = {
  stupid_toggle_components,
  ethjs,
  ethereumProvider,
  HOC/formInput/votingModal/sendTransaction: {
    amount,
    vote
  },
  contracts: {
    registry,
    voting,
    token,
    parameterizer
  }
}

const reduxState = {
  ethereum: {
    network,
    address,
    balance,
    token: {
      address,
      balance,
      allowances: {
        registry: {
          address: '0x13b22222222',
          total: new BN(1253),
          locked: new BN(23)
        },
        voting: {
          address: '0x324b3513445',
          total: new BN(1253),
          locked: new BN(23)
        }
      }
    }
  },
  listings: {
    byListing: {
      'adchain.com': {
        listing,
        owner,
        challenger,
        whitelisted,
        canBeWhitelisted,
        golem: {
          sender,
          blockHash,
          blockNumber,
          timestamp,
          txHash,
          txIndex,
          numTokens,
          event,
          logIndex,
          pollID
        }
      },
      'kangarang': {
        listing,
        owner,
        challenger,
        whitelisted,
        canBeWhitelisted,
        block: {
          hash,
          number,
          timestamp,
          transaction: {
            txHash,
            txIndex,
            sender,
            numTokens,
            event,
            logIndex,
            pollID
          }
        }
      },
      'consensys.net': {
        listing: 'consensys.net',
        owner,
        challenger,
        whitelisted,
        canBeWhitelisted,
        block: {
          hash,
          number,
          timestamp
        },
        transactions: {
          '0xb2345v23': {
            txHash: '0xb2345v23',
            txIndex: 4,
            sender,
            numTokens,
            event,
            logIndex,
            pollID
          },
          '0x124b1ecd': {
            txHash: '0x124b1ecd',
            txIndex: 1,
            sender,
            numTokens,
            event,
            logIndex,
            pollID
          }
        }
      }
    },
    allListings: ['adchain.com', 'kangarang', 'consensys.net']
  },
  parameters: {
    minDeposit,
    appExpiry,
    commitStageLen,
    revealStageLen,
    voteQuorum
  },
  loading: {
    type: 'contract',
    message: ''
  },
  error: {
    type: 'contract',
    message: ''
  },
  visiblityFilter: {
    listings: ['in_application', 'in_whitelist'],
    isPolling: false,
    offset: 0,

    uiSection1: {},
    uiSection2: {}
  }
}
```