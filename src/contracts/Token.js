import contract from 'truffle-contract'

import { toDecimalPower, fromToken, toToken } from '../libs/units'
import abis from './abis'
import { getDefaults } from './defaults'

export default class Token {
  constructor(eth, account, registry) {
    return this.setupToken(eth, account, registry)
  }

  setupToken = async (eth, account, registry) => {
    const TokenContract = contract(abis.HumanStandardToken)
    TokenContract.setProvider(eth.currentProvider);
    TokenContract.defaults(getDefaults(account))

    if (typeof TokenContract.currentProvider.sendAsync !== "function") {
      TokenContract.currentProvider.sendAsync = function() {
        return TokenContract.currentProvider.send.apply(
          TokenContract.currentProvider, arguments
        )
      }
    }
    this.address = await registry.token.call()
    this.contract = await TokenContract.at(this.address)

    await this.params()

    const tokenBalance = await this.contract.balanceOf(account)

    this.balance = fromToken(tokenBalance, this.decimalPower).toString(10)

    return this
  }

  params = async () => {
    this.name = await this.contract.name.call()
    this.decimals = (await this.contract.decimals.call()).toString(10)
    this.symbol = await this.contract.symbol.call()
    this.version = await this.contract.version.call()
    this.decimalPower = toDecimalPower(this.decimals)
  }

  approve = (address, amount) => {
    const tokens = toToken(amount, this.decimalPower).toString(10)
    this.contract.approve(address, tokens)
  }

  allowance = async (owner, spender) => {
    const tokensAllowed = await this.contract.allowance(owner, spender)
    this.tokensAllowed = fromToken(tokensAllowed, this.decimalPower).toString(
      10
    )

    return this.tokensAllowed
  }
}
