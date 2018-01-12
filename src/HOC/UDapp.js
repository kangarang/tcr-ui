import React, { Component } from 'react'
import Ethjs from "ethjs"
import EthAbi from "ethjs-abi"

import { commonUtils } from '../sagas/utils'
import registryContract from '../contracts/Registry.json'

const UDapp = (WrappedComponent, selectVFilter) => {
  return class UDapp extends Component {
    constructor(props) {
      super(props)
      this.state = {
        contract: {
          abi: registryContract.abi,
          address: '0xaa588d3737b611bafd7bd713445b314bd453a5c8',
        },
        eventStream: [],
        fromAddress: false,
      }
    }

    componentDidMount() {
      setTimeout(this.initUDapp, 1000)
    }

    initUDapp = async () => {
      console.log('HOC props:', this.props)

      this.eth = new Ethjs(new Ethjs.HttpProvider('http://localhost:7545'))
      const fromAddress = (await this.eth.accounts())[0]

      this.setState({
        fromAddress,
      })
    }

    handleInputChange = (method, e, index, input) => {
      console.log('input', input)
      let value = e.target.value
      if (input.type === 'bytes32') {
        value = commonUtils.getListingHash(value)
      }
      console.log('value', value)

      this.setState(prevState => ({
        ...prevState,
        [method.name]: {
          ...prevState[method.name],
          [input.name]: value,
        }
      }))
      console.log('method', method)
      console.log('this.state', this.state)
      return true
    }

    handleCall = (e, method) => {
      e.preventDefault()
      const args = Object.values(this.state[method.name])
      const txData = EthAbi.encodeMethod(method, args)
      console.log('txData', txData)
      const payload = {
        method: 'eth_call',
        params: [{
          from: this.state.fromAddress,
          to: this.state.contract.address,
          data: txData,
        }]
      }
      console.log('exec:', method.name, args, payload)
      return this.eth.currentProvider.sendAsync(payload, console.log)
      // return this.eth.call(payload, console.log)
    }

    handleExecute = (e, method) => {
      e.preventDefault()
      console.log('method', method)
      const args = Object.values(this.state[method.name])
      console.log('args', args)
      const txData = EthAbi.encodeMethod(method, args)
      console.log('txData', txData)
      // const payload = {
      //   id: 1,
      //   method: 'eth_sendTransaction',
      //   params: [{
      //     from: this.state.fromAddress,
      //     to: this.state.contract.address,
      //     data: txData,
      //   }]
      // }
      const txn = {
        from: this.state.fromAddress,
        gas: '0x44aa20',
        gasPrice: '0x5d21dba00',
        to: this.state.contract.address,
        data: txData,
      }
      // console.log('exec:', method.name, args, payload)
      // return this.eth.currentProvider.sendAsync(payload, console.log)
      return this.eth.sendTransaction(txn)
    }

    render() {
      return (
        <WrappedComponent
          hocInputChange={this.handleInputChange}
          hocCall={this.handleCall}
          hocSendTransaction={this.handleExecute}
          contract={this.state.contract}
          {...this.props}
        />
      )
    }
  }
}

export default UDapp