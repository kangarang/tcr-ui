import { convertLogToListing } from 'libs/listings'

let lastReadBlockNumber = 0

export async function decodeLogs(
  provider,
  registry,
  ContractEvent,
  voting,
  address
) {
  // build filter
  const filter = {
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address,
    topics: ContractEvent.topics,
  }
  // get logs according to filter
  const logs = await provider.getLogs(filter)
  console.log(ContractEvent.name, logs)

  let listings = []
  for (const log of logs) {
    // decode logs
    const logData = await decodeLog(ContractEvent, log)
    const { block, tx } = await getBlockAndTxnFromLog(log, provider)

    // transform into a listing object
    const listing = await convertLogToListing(
      logData,
      block,
      tx,
      ContractEvent.name,
      registry,
      voting
    )
    listings.push(listing)
  }
  return listings
}

export async function decodeLog(ContractEvent, log) {
  return ContractEvent.parse(log.topics, log.data)
}

export async function getBlockAndTxnFromLog(log, provider) {
  // get block and txn
  const block = await provider.getBlock(log.blockHash)
  const tx = await provider.getTransaction(log.transactionHash)
  return { block, tx }
}