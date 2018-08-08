import EthAbi from 'ethjs-abi'

import _utils from 'modules/logs/utils'
import { setEthjs } from 'libs/provider'
import { baseToConvertedUnit } from 'libs/units'

import token from './abis/EIP20.json'
import { tsToMonthDate } from '../src/utils/_datetime'

async function getLogs() {
  // setup Ethjs
  const ethjs = await setEthjs()

  // range to search blockchain history
  const blockRange = {
    fromBlock: '4000000',
    toBlock: 'latest',
  }
  // the abi and the address of the contract we want listen to
  const contract = {
    abi: token.abi, // EIP20
    address: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd', // ADT
  }
  // specify event name(s) we're interested in receiving
  const eventNames = ['Transfer']
  // specify indexed event emission args (topics)
  const indexedFilterValues = {
    _to: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975', // PLCRVoting
    // _from: '0xDEADBEEF'
  }

  // prettier-ignore
  // create a filter using a helper function
  const filter = await _utils.getFilter(
    blockRange, contract, eventNames, indexedFilterValues
  )
  console.log('created a filter.')

  // get raw encoded logs
  console.log('now fetching event logs...')
  const rawLogs = await ethjs.getLogs(filter)

  // decode those logs
  console.log('decoding..')
  const decoder = await EthAbi.logDecoder(abi)
  const decodedLogs = await decoder(rawLogs)

  // package the logs into an array of normalized objects
  const lawgs = await Promise.all(
    rawLogs.map(async (log, index) => {
      const { block, tx } = await _utils.getBlockAndTxnFromLog(log, ethjs)
      const { _value, _from } = decodedLogs[index]
      return {
        from: _from,
        value: baseToConvertedUnit(_value, '9'),
        txHash: tx.hash,
        blockNumber: block.number.toString(),
        date: tsToMonthDate(block.timestamp.toNumber()),
      }
    })
  )

  // filter the logs by Transfer value
  const filterValue = 5000000
  // whale-watching
  const filteredLogs = lawgs.filter(lawg => lawg.value > filterValue)
  // prettier-ignore
  console.log(`${rawLogs.length} total. ${filteredLogs.length} logs with value greater than ${filterValue}.\n`)

  // print those filtered log values
  return filteredLogs.forEach(({ from, value, txHash, blockNumber, date }) => {
    console.log('from:', from)
    console.log('value:', value)
    console.log('txHash:', txHash)
    console.log('blockNumber:', blockNumber)
    console.log('date:', date)
    console.log('')
  })

  // print: address | numTokens listingID
  // 0xd09cc3bc  |  2345 yeehaw
  // logs.forEach(event => {
  //   const match = findListing(event.logData, allListings)
  //   if (event.logData.numTokens && match) {
  //     console.log(
  //       event.txOrigin.slice(0, 10),
  //       ' | ',
  //       baseToConvertedUnit(
  //         event.logData.numTokens,
  //         tcr.get('tokenDecimals')
  //       ).toString(),
  //       match.get('listingID')
  //     )
  //   }
  // })
}

getLogs()
