import Ethjs from 'ethjs'
import EthEvents from 'eth-events'

import {
  buildContract,
  printCommitVote,
  printClaimReward,
  printTokenTransfer,
} from './utils'

const provider = new Ethjs.HttpProvider(`https://mainnet.infura.io`)
const ethjs = new Ethjs(provider)

const contract = buildContract('adChain', 'registry')
const ethEvents = new EthEvents(ethjs, contract)

const fromBlock = '6000000'
const toBlock = 'latest'

const eventNames = ['Transfer']
const indexedFilterValues = {
  _to: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975',
}

ethEvents.getLogs(fromBlock, toBlock, eventNames, indexedFilterValues).then(logs => {
  console.log(`${logs.length} logs`)

  logs.forEach(({ logData, txData }) => {
    printTokenTransfer(logData, txData)
  })
})
