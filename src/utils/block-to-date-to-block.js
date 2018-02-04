// Augur utils
// https://github.com/AugurProject/augur/blob/seadragon/src/utils/date-to-block-to-date.js

const MILLIS_PER_BLOCK = 12000

export function blockToDate(block, currentBlock) {
  const seconds = (block - currentBlock) * (MILLIS_PER_BLOCK / 1000)
  const now = new Date()
  now.setSeconds(now.getSeconds() + (seconds))
  return now
}

export function dateToBlock(date, currentBlock) {
  const milliDelta = date.getTime() - new Date().getTime()
  const blockDelta = parseInt(milliDelta / MILLIS_PER_BLOCK, 10)
  return currentBlock + blockDelta
}

// Period is in days
export const createPeriodPLSelector = period => createSelector(
  selectAccountTradesState,
  selectBlockchainState,
  selectOutcomesDataState,
  (accountTrades, blockchain, outcomesData) => {
    if (!accountTrades || !blockchain) return null

    const periodDate = new Date(Date.now() - (period*24*60*60*1000))
    const periodBlock = dateToBlock(periodDate, blockchain.currentBlockNumber)

    return Object.keys(accountTrades).reduce((p, marketID) => { // Iterate over marketIDs
      if (!outcomesData[marketID]) return p

      const accumulatedPL = Object.keys(accountTrades[marketID]).reduce((p, outcomeID) => { // Iterate over outcomes
        const periodTrades = accountTrades[marketID][outcomeID].filter(trade => trade.blockNumber > periodBlock) // Filter out trades older than 30 days
        const lastPrice = selectOutcomeLastPrice(outcomesData[marketID], outcomeID)
        const { realized, unrealized } = augur.trading.calculateProfitLoss({ trades: periodTrades, lastPrice })
        return p.plus(new BigNumber(realized, 10).plus(new BigNumber(unrealized, 10)))
      }, ZERO)

      return p.plus(accumulatedPL)
    }, ZERO)
  }
)