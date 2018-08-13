import Token from './abis/EIP20.json'
import PLCRVoting from './abis/PLCRVoting.json'
import Registry from './abis/Registry.json'

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
  },
}

export function findMatch(logData, txData) {
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

export function printTokenTransfer(logData, txData) {
  console.log('from:', logData._from)
  console.log('value:', fromTokenBase(logData._value, '9'))
  console.log('txHash:', txData.txHash)
  console.log('blockNumber:', txData.blockNumber)
  console.log('date:', txData.date)
  console.log('')
}

export function printCommitVote(logData, txData) {
  console.log('pollID:', logData.pollID.toString())
  console.log('numTokens:', logData.numTokens.toString())
  console.log('voter:', logData.voter)
  console.log('txHash:', txData.txHash)
  console.log('blockNumber:', txData.blockNumber)
  console.log('date:', txData.date)
  console.log('')
}

export function printClaimReward(logData) {
  console.log('pollID:', logData.challengeID.toString())
  console.log('voter:', logData.voter)
  console.log('reward:', fromTokenBase(logData.reward, '9'))
  console.log('reward:', logData.reward.toString())
  console.log('')
}
