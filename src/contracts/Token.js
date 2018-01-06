import {
  // bigTen,
  decimalConversion,

  toToken,
  fromToken,

  // withCommas,

  // toWei,
  // toEther,

  // trimDecimalsThree,
} from '../libs/units'
import abis from './abis'

export default class Token {
  constructor(eth, account, registry) {
    return this.setupToken(eth, account, registry)
  }

  setupToken = async (eth, account, registry) => {
    const TokenContract = eth.contract(abis.HumanStandardToken.abi, abis.HumanStandardToken.bytecode, {
      from: account,
      gas: 450000,
      gasPrice: 25000000000,
    })

    this.address = (await registry.token.call())['0']
    this.contract = await TokenContract.at(this.address)

    await this.params()

    const tokenBalance = (await this.contract.balanceOf(account))['0']
    // console.log('tokenBalance', tokenBalance)
    // console.log('natural unit balance:', tokenBalance.toString(10))
    this.balance = fromToken(tokenBalance, this.decimalPower).toString(10)

    return this
  }

  params = async () => {
    this.name = (await this.contract.name.call())['0']
    this.decimals = (await this.contract.decimals.call())['0']
    this.symbol = (await this.contract.symbol.call())['0']
    this.version = (await this.contract.version.call())['0']
    this.decimalPower = decimalConversion(this.decimals)
  }

  approve = async (address, amount) => {
    const tokens = toToken(amount, this.decimalPower).toString(10)
    const approval = (await this.contract.approve(address, tokens))['0']
    console.log('approval', approval)
    return approval
  }

  allowance = async (owner, spender) => {
    const tokensAllowed = (await this.contract.allowance(owner, spender))['0']
    this.tokensAllowed = fromToken(tokensAllowed, this.decimalPower).toString(10)
    return this.tokensAllowed
  }
}
