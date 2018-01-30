import contract from 'truffle-contract'
import abis from '../abis'
import { getDefaults } from './defaults'

import { decimalConversion } from '../libs/units'
import value_utils from '../utils/value_utils'

class ContractFactory {
  constructor(eth, account, registry, c) {
    return this.initContract(eth, account, registry, c)
  }

  initContract = async (eth, account, registry, c) => {
    // const Contract = await eth.contract(abis[c].abi, abis[c].bytecode, {
    //   from: account,
    //   gas: 450000,
    //   gasPrice: 25000000000,
    // })

    // const address = (await registry[c].call())['0']
    // this.contract = await Contract.at(address)

    // this.address = this.contract.address
    // this.parameters = {}
    // await this.params(c, account)
    // return this

    // truffle-contract
    const Contract = contract(abis[c])
    Contract.setProvider(eth.currentProvider)
    Contract.defaults(getDefaults(account))
    // if (typeof Contract.currentProvider.sendAsync !== 'function') {
    // Contract.currentProvider.sendAsync = function() {
    //   return Contract.currentProvider.send.apply(
    //     Contract.currentProvider,
    //     arguments
    //   )
    // }
    // }
    console.log('registry', registry)
    this.address = await registry[c].call()
    this.contract = await Contract.at(this.address)

    this.parameters = {}

    await this.params(c, account)
    return this
  }

  params = async (c, account) => {
    if (c === 'parameterizer') {
      this.parameters.minDeposit = (await this.contract.get(
        'minDeposit'
      )).toString(10)
      this.parameters.applyStageLen = (await this.contract.get(
        'applyStageLen'
      )).toString(10)
      this.parameters.commitStageLen = (await this.contract.get(
        'commitStageLen'
      )).toString(10)
      this.parameters.revealStageLen = (await this.contract.get(
        'revealStageLen'
      )).toString(10)
      this.parameters.dispensationPct = (await this.contract.get(
        'dispensationPct'
      )).toString(10)
      this.parameters.voteQuorum = (await this.contract.get(
        'voteQuorum'
      )).toString(10)
      this.votingRights = ''
    } else if (c === 'token') {
      this.name = await this.contract.name.call()
      this.decimals = await this.contract.decimals.call()
      this.symbol = await this.contract.symbol.call()
      this.totalSupply = await this.contract.totalSupply.call()
      this.decimalPower = decimalConversion(this.decimals)
      const tokenBalance = await this.contract.balanceOf.call(account)
      this.balance = value_utils
        .toUnitAmount(tokenBalance, this.decimalPower)
        .toString(10)
    }
  }

  // TODO: either user udapp for this or figure out a more uniform solution
  allowance = async (owner, spender) => {
    const tokenBalance = await this.contract.balanceOf.call(owner)
    this.balance = value_utils
      .toUnitAmount(tokenBalance, this.decimalPower)
      .toString(10)

    const tokensAllowed = await this.contract.allowance.call(owner, spender)
    this.tokensAllowed = value_utils
      .toUnitAmount(tokensAllowed, this.decimalPower)
      .toString(10)

    return {
      allowance: this.tokensAllowed,
      balance: this.balance,
    }
  }
}

export default ContractFactory
