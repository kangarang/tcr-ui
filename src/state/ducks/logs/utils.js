// import { convertDecodedLogs } from 'state/ducks/listings/utils'

export async function getBlockAndTxnFromLog(log, ethjs) {
  const block = await ethjs.getBlockByHash(log.blockHash, false)
  const tx = await ethjs.getTransactionByHash(log.transactionHash)
  return { block, tx }
}

// let lastReadBlockNumber = 0

// export async function decodeLogs(provider, ContractEvent, address) {
//   // build filter
//   const filter = {
//     fromBlock: lastReadBlockNumber,
//     toBlock: 'latest',
//     address,
//     topics: ContractEvent.topics,
//   }
//   // get logs according to filter
//   const logs = await provider.getLogs(filter)
//   let decodedLogs = []
//   for (const log of logs) {
//     const dLog = await decodeLog(ContractEvent, log, provider)
//     decodedLogs.push(dLog)
//   }
//   // console.log('1 decodedLogs', decodedLogs)
//   return decodedLogs
// }
// export async function decodeLog(ContractEvent, log, provider) {
//   const logData = await ContractEvent.parse(log.topics, log.data)
//   const { block, tx } = await getBlockAndTxnFromLog(log, provider)
//   const txData = {
//     txHash: tx.hash,
//     blockHash: block.hash,
//     ts: block.timestamp,
//   }
//   return {
//     logData,
//     txData,
//     eventName: ContractEvent.name,
//     msgSender: tx.from,
//   }
// }
