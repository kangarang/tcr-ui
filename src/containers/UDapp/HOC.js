import React, { Component } from 'react'

import EthAbi from 'ethjs-abi'

import registryContract from '../../contracts/Registry.json'
import votingContract from '../../contracts/PLCRVoting.json'
import tokenContract from '../../contracts/EIP20.json'
import paramContract from '../../contracts/Parameterizer.json'

import valUtils from '../../libs/values'
import { getProvider, getEthjs } from '../../libs/provider'

const contracts = {
  registry: registryContract,
  voting: votingContract,
  token: tokenContract,
  parameterizer: paramContract,
}

const UDappHOC = WrappedComponent => {
  return class UDapp extends Component {
    constructor(props) {
      super(props)
      // const network = props.wallet.get('network')

      this.state = {
        registry: {
          abi: contracts.registry.abi,
          address: contracts.registry.networks['4'].address,
        },
        fromAddress: false,
        voting: {
          abi: contracts.voting.abi,
          address: contracts.voting.networks['4'].address,
        },
        parameterizer: {
          abi: contracts.parameterizer.abi,
          address: contracts.parameterizer.networks['4'].address,
        },
        token: {
          abi: contracts.token.abi,
          address: contracts.token.networks['4'].address,
        },
        sliderValue: '',
        callResult: '',
      }
    }

    componentDidMount() {
      this.initUDapp()
    }

    initUDapp = async () => {
      const provider = getProvider()

      if (typeof provider !== 'undefined') {
        this.eth = getEthjs()
        const fromAddress = (await this.eth.accounts())[0]

        this.setState({
          fromAddress,
        })
      }
    }

    handleInputChange = (method, e, index, input) => {
      let result = e.target.value

      // TODO: explain this. also, figure out a better way to handle different inputs
      if (input.name === '_secretHash') {
        this.salt = valUtils.randInt(1e6, 1e8)
        console.log('salt', this.salt)
        result = valUtils.getVoteSaltHash(
          e.target.value,
          this.salt.toString(10)
        )
      } else if (input.type === 'bytes32') {
        result = valUtils.getListingHash(e.target.value)
      }
      console.log('salt', this.salt)

      console.log('method, result, input', method, result, input)

      this.setState(prevState => ({
        ...prevState,
        [method.name]: {
          ...prevState[method.name],
          [input.name]: result,
        },
      }))
      console.log('this.state', this.state)
    }

    // adapted from:
    // https://github.com/kumavis/udapp/blob/master/index.js#L158
    handleCall = async (method, contract) => {
      const args = method.inputs.map((input, ind) => {
        return this.state[method.name][input.name]
      })
      try {
        const txData = EthAbi.encodeMethod(method, args)
        console.log('args', args)
        console.log('txData', txData)
        const params = {
          from: this.state.fromAddress,
          to: this.state[contract].address,
          data: txData,
        }
        const called = await this.eth.call(params, 'latest')
        const decint = parseInt(called, 'hex')
        console.log('CALL RESULT', decint)
        this.setState({
          callResult: decint,
        })
        return decint
      } catch (err) {
        if (args.filter(Boolean).length !== args.length) return
        console.warn(err)
      }
    }

    // adapted from:
    // https://github.com/kumavis/udapp/blob/master/index.js#L63
    handleExecute = async (e, method, contract) => {
      e.preventDefault()
      const args = Object.values(this.state[method.name])
      const txData = EthAbi.encodeMethod(method, args)
      console.log('method, args, txData', method, args, txData)
      const payload = {
        from: this.state.fromAddress,
        gas: '0x32aa20',
        gasPrice: '0x4021dba00',
        to: this.state[contract].address,
        data: txData,
      }
      console.log('exec:', method.name, args, payload)
      const txHash = await this.eth.sendTransaction(payload)
      console.log('txHash', txHash)
      return txHash
    }

    render() {
      return (
        <WrappedComponent
          registry={this.state.registry}
          hocInputChange={this.handleInputChange}
          hocCall={this.handleCall}
          hocSendTransaction={this.handleExecute}
          voting={this.state.voting}
          token={this.state.token}
          decodedValues={this.state.decodedValues}
          callResult={this.state.callResult}
          {...this.props}
        />
      )
    }
  }
}

export default UDappHOC
