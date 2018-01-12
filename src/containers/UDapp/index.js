import React, { Component } from 'react'

import Methods from '../../components/Methods'
import H1 from '../../components/H1'
import UDappHOC from '../../HOC/UDapp'

import Button from '../../components/Button'
import Input from './components/Input.js'

const styles = {
  container: {
    padding: '0 3em',
  }
}

class UDapp extends Component {

  renderMethod(method, contract) {
    const inputs = method.inputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    const outputs = method.outputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    return (
      <div key={method.name}>
        <h4>{`${method.name} -> ${this.props.decodedValues} ${outputs}`}</h4>

        {method.inputs.map((input, ind) => (
          <form key={input.name + ind} onSubmit={e => this.props.hocCall(e, method, contract)}>
            <Input
              id={input.name}
              placeholder={`${input.name} (${input.type})`}
              onChange={e => this.props.hocInputChange(method, e, ind, input)}
            />
          </form>
        ))}
        {method.constant ? <Button onClick={(e) => this.props.hocCall(e, method, contract)}>{'Call'}</Button> : (
          <Button onClick={(e) => this.props.hocSendTransaction(e, method, contract)}>{'Send Transaction'}</Button>
        )}
        <br />
        <br />
      </div>
    )
  }

  render() {
    // const registryEvents = (this.props.registry.abi || []).filter((methodInterface) => methodInterface.type === 'event')
    const registryMethods = (this.props.registry.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const registryMethodsWithArgs = registryMethods.filter((methodInterface) => methodInterface.inputs.length > 0)

    const tokenMethods = (this.props.token.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const tokenMethodsWithArgs = tokenMethods.filter((methodInterface) => methodInterface.inputs.length > 0)

    const votingMethods = (this.props.voting.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const votingMethodsWithArgs = votingMethods.filter((methodInterface) => methodInterface.inputs.length > 0)

    return (
      <div style={styles.container}>
        <H1 className="UDapp-title">U D A P P</H1>
        <Methods>
          <div>
            {this.props.registry.address}
            {registryMethodsWithArgs.map((one) => this.renderMethod(one, 'registry'))}
          </div>
          <div>
            {this.props.token.address}
            {tokenMethodsWithArgs.map((one) => this.renderMethod(one, 'token'))}
          </div>
          <div>
            {this.props.voting.address}
            {votingMethodsWithArgs.map((one) => this.renderMethod(one, 'voting'))}
          </div>
          {/* {registryEvents.map((one) => (
            <div key={one.name}>{JSON.stringify(one)}</div>
          ))} */}


          {/* {eventStream.map((one) => (
            <div key={one.value}>{JSON.stringify(one)}</div>
          ))} */}
        </Methods>
      </div>
    )
  }
}

export default UDappHOC(UDapp)