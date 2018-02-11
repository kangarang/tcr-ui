import React, { Component } from 'react'

import abis from '../../abis'

import unit_value_utils, { randInt } from '../../utils/unit-value-conversions'
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

    // this is a hack to make default values work
    componentWillReceiveProps(newProps) {
      console.log('HOC OLD PROPS:', this.props)
      console.log('HOC NEW PROPS:', newProps)

      if (newProps.request.get('context').size > 0) {
        const listingStr = newProps.request.getIn(['context', 'listing'])
        const _pollID = newProps.request.getIn(['context', 'latest', 'pollID'])

        // if (newProps.request.)
        this.setState(prevState => ({
          ...prevState,
          [newProps.actions[0]]: {
            ...prevState[newProps.actions[0]],
            _listingHash: listingStr,
            _data: listingStr,
            _pollID,
            // _prevPollID,
          },
        }))
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
    handleHOCCall = async (e, method, contract) => {
      e.preventDefault()
      const args = await this.getMethodArgs(method)
      const inputNames = method.inputs.map(inp => inp.name)
      const finalArgs = this.checkInputs(inputNames, args, method.name)
      this.props.handleCall({ method, finalArgs, contract })
    }

    handleHOCSendTransaction = async (e, method, contract) => {
      e.preventDefault()
      const args = this.getMethodArgs(method)
      const inputNames = method.inputs.map(inp => inp.name)
      const finalArgs = this.checkInputs(inputNames, args, method.name)
      this.props.handleSendTransaction({
        method,
        finalArgs,
        contract,
        type: 'ethjs',
      })
    }

    render() {
      return (
        <WrappedComponent
          hocInputChange={this.handleInputChange}
          hocCall={this.handleHOCCall}
          hocSendTransaction={this.handleHOCSendTransaction}
          registry={this.state.registry}
          voting={this.state.voting}
          token={this.state.token}
          callResult={this.state.callResult}
          currentMethod={this.state.currentMethod}
          {...this.props}
        />
      )
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
        const actualAmount = unit_value_utils.toNaturalUnitAmount(
          args[indexOfAmount],
          18
        )
        args[indexOfAmount] = actualAmount.toString(10)
      }
      if (inputNames.includes('_value')) {
        const indexOfValue = inputNames.indexOf('_value')
        const actualValue = unit_value_utils.toNaturalUnitAmount(
          args[indexOfValue],
          18
        )
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
        const actualNumTokens = unit_value_utils.toNaturalUnitAmount(
          args[indexOfNumTokens],
          18
        )
        args[indexOfNumTokens] = actualNumTokens.toString(10)
      }

      if (inputNames.includes('_secretHash')) {
        const indexOfSecretHash = inputNames.indexOf('_secretHash')
        const salt = randInt(1e6, 1e8)
        const secretHash = vote_utils.getVoteSaltHash(
          args[indexOfSecretHash],
          salt.toString(10)
        )
        alert('SALT: ' + salt)
        args[indexOfSecretHash] = secretHash
      }
      return args
    }
  }
}

export default UDappHOC
