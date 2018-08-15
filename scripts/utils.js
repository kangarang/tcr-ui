import BN from 'bn.js'
import Token from './abis/EIP20.json'
import PLCRVoting from './abis/PLCRVoting.json'
import Registry from './abis/Registry.json'
const BN = require('bn.js')

import { fromTokenBase } from 'libs/units'

export const contracts = {
  abis: {
    token: Token.abi,
    voting: PLCRVoting.abi,
    registry: Registry.abi,
  },
  addresses: {
    adChain: {
      token: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
      voting: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975',
      registry: '0x5e2eb68a31229b469e34999c467b017222677183',
    },
    ethaireum: {
      token: '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891',
    }
  },
}

export function findMatch(logData, txData, listings) {
  // find matching log
  // const match = find({ 'logData': { 'challengeID': logData.challengeID } }, listings)
  // console.log('match:', match)
}

export function buildContract(tcr = 'adChain', contract) {
  return {
    abi: contracts.abis[contract],
    address: contracts.addresses[tcr][contract],
  }
}

let addressBalances = {
  kareem: 'HI!'
}
let balancesIncludingVotingTokens = {
}

export function printTokenTransfer(logData, txData) {
  console.log('from:', logData._from)
  console.log('to:', logData._to)
  console.log('value:', fromTokenBase(logData._value, '18'))
  console.log('txHash:', txData.txHash)
  console.log('blockNumber:', txData.blockNumber)
  console.log('blockTimestamp:', txData.blockTimestamp.toNumber())
  if (addressBalances.hasOwnProperty(logData._to) && addressBalances.hasOwnProperty(logData._from)) {
    addressBalances[logData._to] = new BN(addressBalances[logData._to]).add(logData._value).toString()
    addressBalances[logData._from] = new BN(addressBalances[logData._from]).sub(logData._value).toString()
  } else if (!addressBalances.hasOwnProperty(logData._to) && addressBalances.hasOwnProperty(logData._from)) {
    addressBalances[logData._to] = logData._value.toString()
    addressBalances[logData._from] = new BN(addressBalances[logData._from]).sub(logData._value).toString()
  } else {
    addressBalances[logData._to] = logData._value.toString()
    addressBalances[logData._from] = logData._value.toString()
  }

  console.log(addressBalances)
  console.log('')
}

export function printCommitVote(logData, txData) {
  console.log('pollID:', logData.pollID.toString())
  console.log('numTokens:', logData.numTokens.toString())
  console.log('voter:', logData.voter)
  console.log('txHash:', txData.txHash)
  console.log('blockNumber:', txData.blockNumber)
  console.log('blockTimestamp:', txData.blockTimestamp)
  console.log('')
}

export function printClaimReward(logData) {
  console.log('pollID:', logData.challengeID.toString())
  console.log('voter:', logData.voter)
  console.log('reward:', fromTokenBase(logData.reward, '9'))
  console.log('reward:', logData.reward.toString())
  console.log('')
}
