import React, { Component } from 'react'
import EthAbi from 'ethjs-abi'

import abis from '../../abis'

import value_utils from '../../utils/value_utils'
import vote_utils from '../../utils/vote_utils'

const UDappHOC = WrappedComponent => {
  return class UDapp extends Component {
    constructor(props) {
      super(props)

      this.state = {
        fromAddress: false,
        registry: {
          abi: abis.registry.abi,
          address: abis.registry.networks[props.networkId].address,
        },
        voting: {
          abi: abis.voting.abi,
          address: abis.voting.networks[props.networkId].address,
        },
        parameterizer: {
          abi: abis.parameterizer.abi,
          address: abis.parameterizer.networks[props.networkId].address,
        },
        token: {
          abi: abis.token.abi,
          address: abis.token.networks[props.networkId].address,
        },
        callResult: '',
        currentMethod: '',
      }
    }

    handleInputChange = async (e, method, input) => {
      const methName = method.name
      const inputName = input.name

      const inputValue = e.target.value

      this.setState(prevState => ({
        ...prevState,
        [methName]: {
          ...prevState[methName],
          [inputName]: inputValue,
        },
        currentMethod: methName,
      }))
    }

    getMethodArgs = method =>
      method.inputs.map(input => this.state[method.name][input.name])

    // adapted from:
    // https://github.com/kumavis/udapp/blob/master/index.js#L158
    handleCall = async (e, method, contract) => {
      e.preventDefault()
      const args = await this.getMethodArgs(method)
      const inputNames = method.inputs.map(inp => inp.name)
      const newArgs = this.checkInputs(inputNames, args, method.name)

      try {
        const txData = EthAbi.encodeMethod(method, newArgs)
        const params = {
          from: this.props.account,
          to: this.state[contract].address,
          data: txData,
        }
        const called = await this.props.ethjs.call(params, 'latest')
        const decint = parseInt(called, 10)
        const hexint = parseInt(called, 16)
        console.log('CALL (dec):', decint)
        console.log('CALL (hex):', hexint)
        const cr = hexint === 0 ? 'false' : hexint === 1 ? 'true' : decint
        this.setState({
          callResult: cr,
        })
      } catch (err) {
        // if (args.filter(Boolean).length !== args.length) return
        console.warn(err)
      }
    }

    // inputNames:  ["_listingHash", "_amount", "_data"]
    // args:        ["fdsaf", "123", undefined]
    checkInputs = (inputNames, args, methodName) => {
      if (inputNames.includes('_listingHash')) {
        console.log('Inputs require bytes32. Auto-hashing...')
        const indexOfListingHash = inputNames.indexOf('_listingHash')
        const listingString = args[indexOfListingHash] // "fdsaf"
        const listingHash = vote_utils.getListingHash(listingString) // '0xa3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d'
        args[indexOfListingHash] = listingHash // ["0xa3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d", "123", undefined]

        if (inputNames.includes('_data')) {
          const indexOfData = inputNames.indexOf('_data')
          args[indexOfData] = listingString // ["0xa3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d", "123", "fdsaf"]
        }
      }

      if (inputNames.includes('_amount')) {
        const indexOfAmount = inputNames.indexOf('_amount')
        const actualAmount = value_utils.toNaturalUnitAmount(args[indexOfAmount], 18)
        args[indexOfAmount] = actualAmount.toString(10)
      }
      if (inputNames.includes('_value')) {
        const indexOfValue = inputNames.indexOf('_value')
        const actualValue = value_utils.toNaturalUnitAmount(args[indexOfValue], 18)
        args[indexOfValue] = actualValue.toString(10)
      }
      if (
        inputNames.includes(
          '_numTokens' &&
            (methodName === 'requestVotingRights' ||
              methodName === 'withdrawVotingRights')
        )
      ) {
        const indexOfNumTokens = inputNames.indexOf('_numTokens')
        const actualNumTokens = value_utils.toNaturalUnitAmount(
          args[indexOfNumTokens],
          18
        )
        args[indexOfNumTokens] = actualNumTokens.toString(10)
      }

      if (inputNames.includes('_secretHash')) {
        const indexOfSecretHash = inputNames.indexOf('_secretHash')
        const salt = value_utils.randInt(1e6, 1e8)
        console.log('SALT SALT SALT: ', salt)
        const secretHash = vote_utils.getVoteSaltHash(
          args[indexOfSecretHash],
          salt.toString(10)
        )
        alert('SALT: ' + salt)
        args[indexOfSecretHash] = secretHash
      }
      return args
    }

    handleExecute = async (e, method, contract) => {
      e.preventDefault()
      const args = this.getMethodArgs(method)
      const inputNames = method.inputs.map(inp => inp.name)
      const finalArgs = this.checkInputs(inputNames, args, method.name)
      this.props.handleSendTransaction({ method, finalArgs, contract, type: 'ethjs' })
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
