import React, { Component } from 'react'
import Ethjs from 'ethjs'
import EthAbi from 'ethjs-abi'

import Methods from '../../components/Methods'

import registryContract from '../../contracts/Registry.json'
import { commonUtils } from '../../sagas/utils';

// import {
//   selectAddress,
//   selectFromAddress,
//   selectDeposit,
//   selectValues,
//   selectTokenBalance,
//   selectEthBalance,
//   selectProvider,
// } from '../../selectors/udapp';
// import {
//   toEther,
//   withCommas,
//   trimDecimalsThree,
// } from '../../libs/units'

const defaultContractState = {
  abi: registryContract.abi,
  address: '0xaa588d3737b611bafd7bd713445b314bd453a5c8',
}

class UDapp extends Component {
  constructor() {
    super()
    this.state = {
      contract: defaultContractState,
      eventStream: [],
    }
  }

  componentDidMount() {
    setTimeout(this.startApp, 2000)
  }

  startApp = async () => {
    this.provider = new Ethjs.HttpProvider('http://localhost:7545')
    const eth = new Ethjs(this.provider)

    const fromAddress = (await eth.accounts())[0]
    this.setState({
      fromAddress
    })
  }


  decodeAbiOutput = (methodInterface, rawOutput) => {
    const result = EthAbi.decodeMethod(methodInterface, rawOutput)
    result.length = methodInterface.outputs.length
    const resultArray = [].slice.call(result)
    return resultArray
  }

  readMethodArguments(method) {
    return method.inputs.map((arg, index) => {
      const value = this.state[method.name][arg.name]
      if (!value) return
      // const isArray = (arg.type.slice(-2) === '[]')
      console.log('arg', arg)
      console.log('value', value)
      // if (isArray) {
        // try {
        //   return JSON.parse(value)
        // } catch (err) {
          return value 
        // }
      // }
      // return value 
    })
  }

  handleInputChange(method, e, index, input) {
    console.log('input', input)
    let value
    if (input.type === 'bytes32') {
      value = commonUtils.getListingHash(e.target.value)
    } else if (input.type === 'string') {
      value = e.target.value
    } else if (input.type === 'uint256') {
      value = e.target.value
    }

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

  handleCall = (method) => {
    const args = this.readMethodArguments(method)
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
    return this.provider.sendAsync(payload, console.log)
  }

  handleExecute = (method) => {
    console.log('method', method)
    const args = this.readMethodArguments(method)
    console.log('args', args)
    // const args = Object.values(this.state[method.name])
    const txData = EthAbi.encodeMethod(method, args)
    console.log('txData', txData)
    const payload = {
      id: 1,
      method: 'eth_sendTransaction',
      params: [{
        from: this.state.fromAddress,
        to: this.state.contract.address,
        data: txData,
      }]
    }
    console.log('exec:', method.name, args, payload)
    console.log('this.provider', this.provider)
    return this.provider.sendAsync(payload, console.log)
  }

  renderMethod(method) {
    const inputs = method.inputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    const outputs = method.outputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    const rawOutput = this.state.contract.abi[method.name]
    // const decodedValues = rawOutput ? this.decodeAbiOutput(method, rawOutput) : null
    return (
      <div key={method.name}>
        <h4>{`${method.name} (${inputs})`}</h4>
        {method.inputs.map((input, ind) => (
          <form key={input.name + ind}>
            <input
              id={input.name}
              placeholder={`${input.name} (${input.type})`}
              onChange={e => this.handleInputChange(method, e, ind, input)}
            />
          </form>
        ))}
        {/* {method.outputs.length ? `Returns: ${outputs}` : false} */}
        {/* <br /> */}
        {method.constant ? <button onClick={(e) => this.handleCall(method)}>{'C A L L'}</button> : (
          <button onClick={(e) => this.handleExecute(method)}>{'S E N D _ T X N'}</button>
        )}
        <br />
        <br />
      </div>
    )
  }

  render() {
    const events = (this.state.contract.abi || []).filter((methodInterface) => methodInterface.type === 'event')
    const methods = (this.state.contract.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const methodsWithNoArgs = methods.filter((methodInterface) => methodInterface.inputs.length === 0)
    const methodsWithArgs = methods.filter((methodInterface) => methodInterface.inputs.length > 0)
    const getters = methodsWithArgs.filter((methodInterface) => !methodInterface.constant)
    const eventStream = this.state.eventStream || []
    return (
      <div className="UDapp">
        <h1 className="UDapp-title">U D A P P</h1>
        <Methods>
          {/* <form>
            <input rows='10' id='abi' placeholder='abi goes here' onChange={this.handleSetAbi} value={JSON.stringify(this.state.contract.abi)} />
            <input id='address' value={this.state.contract.address} onChange={this.handleSetAddress} />
          </form> */}
          {/* <br /> */}
          {methods.map((one) => this.renderMethod(one))}
          <br />
          {/* {events.map((one) => (
            <div key={one.name}>{JSON.stringify(one)}</div>
            // <div key={one.name}>{`${one.name}: ${JSON.stringify(one.inputs)}`}</div>
          ))}
          <br />
          {eventStream.map((one) => (
            <div key={one.value}>{JSON.stringify(one)}</div>
          ))} */}
        </Methods>
      </div>
    )
  }
}

export default UDapp