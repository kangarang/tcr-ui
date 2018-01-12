import React, { Component } from 'react'

import Methods from '../../components/Methods'
import UDappHOC from '../../HOC/UDapp'

class UDapp extends Component {

  renderMethod(method) {
    const inputs = method.inputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    const outputs = method.outputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    return (
      <div key={method.name}>
        <h4>{`${method.name}`}</h4>
        {method.inputs.map((input, ind) => (
          <form key={input.name + ind} onSubmit={e => this.props.hocCall(e, method)}>
            <input
              id={input.name}
              placeholder={`${input.name} (${input.type})`}
              onChange={e => this.props.hocInputChange(method, e, ind, input)}
            />
          </form>
        ))}
        {method.constant ? <button onClick={(e) => this.props.hocCall(e, method)}>{'call'}</button> : (
          <button onClick={(e) => this.props.hocSendTransaction(e, method)}>{'sendTransaction'}</button>
        )}
        <br />
        <br />
      </div>
    )
  }

  render() {
    const events = (this.props.contract.abi || []).filter((methodInterface) => methodInterface.type === 'event')
    const methods = (this.props.contract.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const methodsWithNoArgs = methods.filter((methodInterface) => methodInterface.inputs.length === 0)
    const methodsWithArgs = methods.filter((methodInterface) => methodInterface.inputs.length > 0)
    const getters = methodsWithArgs.filter((methodInterface) => !methodInterface.constant)
    return (
      <div className="UDapp">
        <h1 className="UDapp-title">U D A P P</h1>
        <Methods>
          {methods.map((one) => this.renderMethod(one))}
          <br />

          {/* {events.map((one) => (
            <div key={one.name}>{JSON.stringify(one)}</div>
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

export default UDappHOC(UDapp)