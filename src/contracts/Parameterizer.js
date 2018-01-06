import abis from './abis'

export default class Parameterizer {
  constructor(eth, account, registry) {
    return this.setupParameterizer(eth, account, registry)
  }

  setupParameterizer = async (eth, account, registry) => {
    const ParameterizerContract = await eth.contract(abis.Parameterizer.abi, abis.Parameterizer.bytecode, {
      from: account,
      gas: 450000,
      gasPrice: 25000000000,
    })

    const address = (await registry.parameterizer.call())['0']
    this.contract = await ParameterizerContract.at(address)
    this.address = this.contract.address

    // TODO: get_storage?
    this.minDeposit = (await this.contract.get('minDeposit'))['0'].toString(10)
    this.pMinDeposit = (await this.contract.get('pMinDeposit'))['0'].toString(10)
    this.applyStageLen = (await this.contract.get('applyStageLen'))['0'].toString(10)
    this.pApplyStageLen = (await this.contract.get('pApplyStageLen'))['0'].toString(10)
    this.commitStageLen = (await this.contract.get('commitStageLen'))['0'].toString(10)
    this.pCommitStageLen = (await this.contract.get('pCommitStageLen'))['0'].toString(10)
    this.revealStageLen = (await this.contract.get('revealStageLen'))['0'].toString(10)
    this.pRevealStageLen = (await this.contract.get('pRevealStageLen'))['0'].toString(10)
    this.dispensationPct = (await this.contract.get('dispensationPct'))['0'].toString(10)
    this.pDispensationPct = (await this.contract.get('pDispensationPct'))['0'].toString(10)
    this.voteQuorum = (await this.contract.get('voteQuorum'))['0'].toString(10)
    this.pVoteQuorum = (await this.contract.get('pVoteQuorum'))['0'].toString(10)

    return this
  }
}
