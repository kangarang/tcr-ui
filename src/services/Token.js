import contract from 'truffle-contract'
import abis from '../contracts'
import { getDefaults } from './defaults'

import {
  decimalConversion,
  toToken,
  fromToken,
} from '../libs/units'

export default class Token {
  constructor(eth, account, registry) {
    return this.setupToken(eth, account, registry)
  }

  setupToken = async (eth, account, registry) => {
    const TokenContract = contract(abis.EIP20)
    TokenContract.setProvider(eth.currentProvider)
    TokenContract.defaults(getDefaults(account))

    this.address = await registry.token.call()
    this.contract = await TokenContract.at(this.address)

    await this.params()

    const tokenBalance = await this.contract.balanceOf(account)
    console.log('tokenBalance', tokenBalance)
    console.log('natural unit balance:', tokenBalance.toString(10))
    this.balance = fromToken(tokenBalance, this.decimalPower).toString(10)

    return this
  }

  params = async () => {
    this.name = await this.contract.name.call()
    this.decimals = await this.contract.decimals.call()
    this.symbol = await this.contract.symbol.call()
    this.totalSupply = await this.contract.totalSupply.call()
    this.decimalPower = decimalConversion(this.decimals)
  }

  approve = async (address, amount, account) => {
    const tokens = toToken(amount, this.decimalPower).toString(10)
    const approval = await this.contract.approve(address, tokens)
    const { allowance, balance } = await this.allowance(account, address)
    return { approval, allowance, balance }
  }

  allowance = async (owner, spender) => {
    const tokensAllowed = await this.contract.allowance(owner, spender)
    this.tokensAllowed = fromToken(tokensAllowed, this.decimalPower).toString(10)
    const obj = {
      allowance: this.tokensAllowed,
      balance: this.balance
    }
    return obj
  }
}
