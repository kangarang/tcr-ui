import EthAbi from 'ethjs-abi'
import _utils from 'modules/logs/utils'
import { setEthjs } from 'libs/provider'
import { baseToConvertedUnit } from 'libs/units'
import token from './abis/EIP20.json'
import { tsToMonthDate } from '../src/utils/_datetime'

async function getLogs() {
  // setup Ethjs
  const ethjs = await setEthjs()

  // adToken
  const contractAddress = '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd'
  // specify event name(s) we're interested in polling
  const eventNames = ['Transfer']
  // specify indexed event emission args (topics)
  const indexedFilterValues = {
    _to: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975', // PLCRVoting
    // _from: '0xDEADBEEF'
  }
  // token abi
  const abi = token.abi
  const blockRange = {
    fromBlock: '4000000',
    toBlock: 'latest',
  }

  // get filter
  const filter = await _utils.getFilter(
    contractAddress,
    eventNames,
    indexedFilterValues,
    abi,
    blockRange
  )
  console.log('created a filter.')
  console.log('getting logs...')
  // get raw encoded logs
  const rawLogs = await ethjs.getLogs(filter)
  console.log('decoding..')
  // decode logs
  const decoder = await EthAbi.logDecoder(abi)
  const decodedLogs = await decoder(rawLogs)

  // package the logs into an array of neat objects
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

  // print details
  return filteredLogs.forEach(({ from, value, txHash, blockNumber, date }) => {
    console.log('from:', from)
    console.log('value:', value)
    console.log('txHash:', txHash)
    console.log('blockNumber:', blockNumber)
    console.log('date:', date)
    console.log('')
  })
}

getLogs()
