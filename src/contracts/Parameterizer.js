import contract from 'truffle-contract'
import abis from './abis'
import { getDefaults } from './defaults'

export default class Parameterizer {
  constructor(eth, account, registry) {
    return this.setupParameterizer(eth, account, registry)
  }

  setupParameterizer = async (eth, account, registry) => {
    const ParameterizerContract = contract(abis.Parameterizer)
    ParameterizerContract.setProvider(eth.currentProvider)
    ParameterizerContract.defaults(getDefaults(account))

    this.address = await registry.parameterizer.call()
    this.contract = await ParameterizerContract.at(this.address)

    // TODO: get_storage?
    this.minDeposit = await this.contract.get('minDeposit').toString(10)
    this.pMinDeposit = await this.contract.get('pMinDeposit').toString(10)
    this.applyStageLen = await this.contract.get('applyStageLen').toString(10)
    this.pApplyStageLen = await this.contract.get('pApplyStageLen').toString(10)
    this.commitStageLen = await this.contract.get('commitStageLen').toString(10)
    this.pCommitStageLen = await this.contract.get('pCommitStageLen').toString(10)
    this.revealStageLen = await this.contract.get('revealStageLen').toString(10)
    this.pRevealStageLen = await this.contract.get('pRevealStageLen').toString(10)
    this.dispensationPct = await this.contract.get('dispensationPct').toString(10)
    this.pDispensationPct = await this.contract.get('pDispensationPct').toString(10)
    this.voteQuorum = await this.contract.get('voteQuorum').toString(10)
    this.pVoteQuorum = await this.contract.get('pVoteQuorum').toString(10)

    return this
  }
}
