import React, { Component } from 'react'
import Eth from 'ethjs'
import EthAbi from 'ethjs-abi'
import BlockTracker from 'eth-block-tracker'
import Suggestor from 'eth-gas-price-suggestor'

import abis from '../../abis'

import { getProvider, getEthjs } from '../../libs/provider'
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
            'CURRENT SUGGESTION in GWEI: ' +
              Eth.fromWei(new Eth.BN(suggested, 10), 'gwei')
          )
          this.setState({
            suggested,
          })
        } catch (e) {
          console.log('failed: ', e)
        }
      }, 5000)
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
      console.log('this.state', this.state)
    }

    getMethodArgs = method =>
      method.inputs.map(input => this.state[method.name][input.name])

    // adapted from:
    // https://github.com/kumavis/udapp/blob/master/index.js#L158
    handleCall = async (e, method, contract) => {
      e.preventDefault()
      const args = await this.getMethodArgs(method)
      const inputNames = method.inputs.map(inp => inp.name)
      const newArgs = this.checkInputs(inputNames, args)

      try {
        const txData = EthAbi.encodeMethod(method, newArgs)
        const params = {
          from: this.state.fromAddress,
          to: this.state[contract].address,
          data: txData,
        }
        const called = await this.eth.call(params, 'latest')

        const decint = parseInt(called, 0)
        const hexint = parseInt(called, 16)

        console.log('CALL (dec):', decint)
        console.log('CALL (hex):', hexint)

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

    checkInputs = (inputNames, args) => {
      // inputNames:  ["_listingHash", "_amount", "_data"]
      // args:        ["fdsaf", "123", undefined]

      if (inputNames.includes('_listingHash')) {
        const indexOfListingHash = inputNames.indexOf('_listingHash')
        // get the str value
        const listingString = args[indexOfListingHash]
        // "fdsaf"

        console.log('Inputs require bytes32. Auto-hashing...')
        const listingHash = vote_utils.getListingHash(listingString)
        // '0xa3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d'

        args[indexOfListingHash] = listingHash
        // args: ["0xa3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d", "123", undefined]

        if (inputNames.includes('_data')) {
          const indexOfData = inputNames.indexOf('_data')
          args[args.length - 1] = listingString
          // args: ["0xa3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d", "123", "fdsaf"]
        }
      }

      if (inputNames.includes('_secretHash')) {
        const indexOfSecretHash = inputNames.indexOf('_secretHash')
        const salt = value_utils.randInt(1e6, 1e8)
        console.log('SALT SALT SALT: ', salt)
        const secretHash = vote_utils.getVoteSaltHash(args[indexOfSecretHash], salt.toString(10))
        args[indexOfSecretHash] = secretHash
    // const pollStruct = await plcr.pollMap.call(pollID)

    // const commitEndDateString = vote_utils.getEndDateString(pollStruct[0])
    // const revealEndDateString = vote_utils.getEndDateString(pollStruct[1])
    window.alert('SALT:', salt)

    // const json = {
    //   listing,
    //   voteOption,
    //   salt: salt.toString(10),
    //   pollID,
    //   pollStruct,
    //   commitEndDateString,
    //   revealEndDateString,
    //   secretHash,
    // }

    // const listingUnderscored = listing.replace('.', '_')
    // const filename = `${listingUnderscored}--pollID_${pollID}--commitEnd_${commitEndDateString}--commitVote.json`

    // if (receipt.receipt.status !== '0x0') {
    //   saveFile(json, filename)
    //   return receipt
    // }
      }

      return args
    }

    // adapted from:
    // https://github.com/kumavis/udapp/blob/master/index.js#L63
    handleExecute = async (method, contract) => {
      console.log('method', method)

      const args = this.getMethodArgs(method)
      console.log('args', args)

      const inputNames = method.inputs.map(inp => inp.name)
      console.log('inputNames', inputNames)

      const finalArgs = this.checkInputs(inputNames, args)
      console.log('finalArgs', finalArgs)

      const txData = EthAbi.encodeMethod(method, finalArgs)
      const nonce = await this.eth.getTransactionCount(this.state.fromAddress)
      const payload = {
        from: this.state.fromAddress,
        gas: 450000,
        gasPrice: this.state.suggested || 25000000000,
        to: this.state[contract].address,
        data: txData,
        nonce,
      }
      console.log('Tx Payload: ', payload)
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
