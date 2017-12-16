import Eth from 'ethjs'
import EthAbi from 'ethjs-abi'
import { toNineToken } from '../libs/units'

const topics = {
  Transfer: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x000000000000000000000000c18195a03e88b91efbe1be9338f15caf9de103cd',
    '0x000000000000000000000000ee5aa77ca7394a114439cfda4f46dd2a7298ce79',
  ],
  _Application: [
    '0x8679b3793e06c33189be2319d77a55df6769e3b9061611d27f1809b3d56d2e68',
  ],
  _Approval: [
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    '0x000000000000000000000000d09cc3bc67e4294c4a446d8e4a2934a921410ed7',
    '0x000000000000000000000000ee5aa77ca7394a114439cfda4f46dd2a7298ce79',
  ],
  _Challenge: [
    '0xf6214eae86f3bedb9e3580242fc0aee0c63d31de315e420dc25917b0614ffe9f',
  ],
  _NewDomainWhitelisted: [
    '0x492f06612b5389b4304f989412f79af523a6c649a0aad67ed85d2f3f1e727ce6',
  ],
  _ChallengeSucceeded: [
    '0xf340a3b60cc69f7c29601c3a7343999504e72a3c96b1ce820aded7352e03feb6',
  ],
  _ApplicationRemoved: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x00000000000000000000000075c35c980c0d37ef46df04d31a140b65503c0eed',
    '0x000000000000000000000000627306090abab3a6e1400e9345bc60c78a8bef57',
  ],
}

export const setupEventSignatures = (contractABI) => {
  const events = {}
  contractABI.filter((method) => method.type === 'event').map((event) => {
    events[event.name] = EthAbi.encodeSignature(event)
    return event
  })
  return events
}

export const buildAndDecodeLogs = async (eth, contract, topic) => {
  const rawLogs = await buildRawLogs(eth, contract, topic)
  const decodedLogs = await decodeLogs(eth, rawLogs, contract.contract)
  return decodedLogs
}

const buildRawLogs = async (eth, contract, topic) =>
  eth.getLogs(buildFilter(contract, topic))

const buildFilter = (contract, topic) => ({
  fromBlock: new Eth.BN('1'),
  toBlock: 'latest',
  address: contract.address,
  topics: topics[topic] || null,
})

const decodeLogs = async (eth, rawLogs, contract) => {
  const decoder = EthAbi.logDecoder(contract.abi)
  const logs = decoder(rawLogs)
  return Promise.all(
    logs.map(async (ev, ind) => {
      const txDetails = await eth.getTransactionByHash(
        rawLogs[ind].transactionHash
      )
      return buildRegistryItem(rawLogs, contract, ev, ind, txDetails)
    })
  )
}

const buildRegistryItem = async (rawLogs, contract, log, i, txDetails) => {
  let unstakedDeposit = '0'
  if (log.deposit) {
    unstakedDeposit = toNineToken(log.deposit)
  }

  const isWhitelisted = await contract.isWhitelisted.call(log.domain)
  let status = 'challengeable'

  if (!isWhitelisted) {
    const canBeWhitelisted = await contract.canBeWhitelisted.call(log.domain)
    if (canBeWhitelisted) {
      status = 'whitelistable'
    }
  }

  return {
    contractAddress: rawLogs[i].address,
    domain: log.domain,
    unstakedDeposit: unstakedDeposit.toString(10),
    challengeID: log.pollID ? log.pollID.toString(10) : false,
    whitelisted: isWhitelisted,
    event: log._eventName,
    blockNumber: rawLogs[i].blockNumber.toString(10),
    blockHash: txDetails.blockHash,
    txHash: rawLogs[i].transactionHash,
    txIndex: txDetails.transactionIndex.toString(10),
    logIndex: rawLogs[i].logIndex.toString(10),
    from: txDetails.from,
    to: txDetails.to,
    status,
  }
}
