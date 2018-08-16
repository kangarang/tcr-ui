import Ethjs from 'ethjs'
import EthEvents from 'eth-events'

import {
  buildContract,
  printTokenTransfer,
} from './utils'

const provider = new Ethjs.HttpProvider(`https://rinkeby.infura.io`)
const ethjs = new Ethjs(provider)

const contract = buildContract('ethaireum', 'token')
const ethEvents = new EthEvents(ethjs, contract)

const fromBlock = '0'
const toBlock = 'latest'
const eventNames = ['Transfer']
const indexedFilterValues = {}

ethEvents.getLogs(fromBlock, toBlock, eventNames, indexedFilterValues).then(logs => {
  logs.forEach(({ logData, txData }) => {
    printTokenTransfer(logData, txData)
  })

  console.log(`${logs.length} logs`)
})
