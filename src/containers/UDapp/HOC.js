import React, { Component } from 'react'
import Eth from 'ethjs'
import EthAbi from 'ethjs-abi'
import BlockTracker from 'eth-block-tracker'
import Suggestor from 'eth-gas-price-suggestor'

import registryContract from '../../abis/Registry.json'
import votingContract from '../../abis/PLCRVoting.json'
import tokenContract from '../../abis/EIP20.json'
import paramContract from '../../abis/Parameterizer.json'

import { getProvider, getEthjs } from '../../libs/provider'
import valUtils from '../../utils/value_utils'
import vote_utils from '../../utils/vote_utils'

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

      this.state = {
        fromAddress: false,
        registry: {
          abi: contracts.registry.abi,
          address: contracts.registry.networks[props.networkId].address,
        },
        voting: {
          abi: contracts.voting.abi,
          address: contracts.voting.networks[props.networkId].address,
        },
        parameterizer: {
          abi: contracts.parameterizer.abi,
          address: contracts.parameterizer.networks[props.networkId].address,
        },
        token: {
          abi: contracts.token.abi,
          address: contracts.token.networks[props.networkId].address,
        },
        callResult: '',
        currentMethod: '',
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
          // console.log(
          //   'CURRENT SUGGESTION in GWEI: ' +
          //     Eth.fromWei(new Eth.BN(suggested, 10), 'gwei')
          // )
          // this.setState({
          //   suggested,
          // })
        } catch (e) {
          console.log('failed: ', e)
        }
      }, 5000)
    }

    handleInputChange = async (e, method, input) => {
      let result = e.target.value
      let data

      if (
        input.name === '_listingHash' &&
        (method.name === 'apply' || method.name === 'challenge')
      ) {
        data = e.target.value
      } else if (input.name === '_listingHash') {
        data = this.state[method.name]._data
      } else {
        // data = 'test name'
      }

      // TODO: explain this. also, figure out a better way to handle different inputs
      if (input.name === '_secretHash') {
        this.salt = valUtils.randInt(1e6, 1e8)
        console.log('salt', this.salt)
        result = vote_utils.getVoteSaltHash(result, this.salt.toString(10))
      } else if (input.type === 'bytes32') {
        result = vote_utils.getListingHash(result)
        // data = result
      }
      console.log('salt', this.salt)

      console.log('method, result, input', method, result, input)

      this.setState(prevState => ({
        ...prevState,
        [method.name]: {
          ...prevState[method.name],
          [input.name]: result,
          _data: data,
        },
        currentMethod: method.name,
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
        console.log('called', called)
        const decint = parseInt(called, 0)
        const hexint = parseInt(called, 16)
        console.log('CALL RESULT', decint)
        console.log('CALL RESULT', hexint)
        const cr = decint === 0 ? 'false' : decint === 1 ? 'true' : decint
        this.setState({
          callResult: cr,
        })
        return cr
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
      const nonce = await this.eth.getTransactionCount(this.state.fromAddress)
      const payload = {
        from: this.state.fromAddress,
        gas: 450000,
        gasPrice: this.state.suggested || 25000000000,
        to: this.state[contract].address,
        data: txData,
        nonce,
      }
      console.log('payload', payload)
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
          currentMethod={this.state.currentMethod}
          {...this.props}
        />
      )
    }
  }
}

export default UDappHOC
