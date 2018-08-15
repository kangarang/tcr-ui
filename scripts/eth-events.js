import Ethjs from 'ethjs'
import EthEvents from 'eth-events'

import {
  buildContract,
  printCommitVote,
  printClaimReward,
  printTokenTransfer,
} from './utils'

const provider = new Ethjs.HttpProvider(`https://rinkeby.infura.io`)
const ethjs = new Ethjs(provider)

const contract = buildContract('ethaireum', 'token')
const ethEvents = new EthEvents(ethjs, contract)

const fromBlock = '0'
const toBlock = 'latest'
const eventNames = ['Transfer']
const indexedFilterValues = {
  // _to: '',
}

ethEvents.getLogs(fromBlock, toBlock, eventNames, indexedFilterValues).then(logs => {
  // console.log('logs[0]:', logs[0].logData._value.toString())
  // console.log('logs[1]:', logs[1].logData._value.toString())
  // console.log('logs[2]:', logs[2].logData._value.toString())
  // console.log('logs[3]:', logs[3].logData._value.toString())
  logs.forEach(({ logData, txData }) => {
    printTokenTransfer(logData, txData)
  })

  console.log(`${logs.length} logs`)
})
