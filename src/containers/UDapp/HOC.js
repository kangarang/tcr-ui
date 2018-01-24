import React, { Component } from 'react'
import Eth from 'ethjs'
import EthAbi from 'ethjs-abi'
import BlockTracker from 'eth-block-tracker'
import Suggestor from 'eth-gas-price-suggestor'

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
      let suggestor
      if (typeof provider !== 'undefined') {
        const blockTracker = new BlockTracker({ provider })
        blockTracker.start()

        suggestor = new Suggestor({
          blockTracker,
          historyLength: 15,
          defaultPrice: 20000000000,
        })

        this.eth = getEthjs()
        const fromAddress = (await this.eth.accounts())[0]

        this.setState({
          fromAddress,
        })
      }

      setInterval(async () => {
        try {
          const suggested = await suggestor.currentAverage()
          console.log('suggested', suggested)
          console.log(
            'CURRENT SUGGESTION in GWEI: ' + Eth.fromWei(suggested, 'gwei')
          )
          this.setState({
            suggested
          })
        } catch (e) {
          console.log('failed: ', e)
        }
      }, 5000)
    }

    handleInputChange = async (e, method, input) => {
      let result = e.target.value

      // TODO: explain this. also, figure out a better way to handle different inputs
      if (input.name === '_secretHash') {
        this.salt = valUtils.randInt(1e6, 1e8)
        console.log('salt', this.salt)
        result = valUtils.getVoteSaltHash(result, this.salt.toString(10))
      } else if (input.type === 'bytes32') {
        result = valUtils.getListingHash(result)
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

    getMethodArgs = method =>
      method.inputs.map(input => this.state[method.name][input.name])

    // adapted from:
    // https://github.com/kumavis/udapp/blob/master/index.js#L158
    handleCall = async (e, method, contract) => {
      e.preventDefault()
      const args = await this.getMethodArgs(method)
      try {
        const txData = EthAbi.encodeMethod(method, args)
        console.log('args, txData', args, txData)
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
    handleExecute = async (method, contract) => {
      const args = this.getMethodArgs(method)
      const txData = EthAbi.encodeMethod(method, args)
      const payload = {
        from: this.state.fromAddress,
        gas: '0x32aa20',
        gasPrice: '0x4021dba00',
        to: this.state[contract].address,
        data: txData,
      }
      const txHash = await this.eth.sendTransaction(payload)
      console.log('TRANSACTION:', txHash)
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
          callResult={this.state.callResult}
          {...this.props}
        />
      )
    }
  }
}

export default UDappHOC
