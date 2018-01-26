import React, { Component } from 'react'
import styled from 'styled-components'

import UDappHOC from './HOC'

import Button from '../../components/Button'
import H3 from '../../components/H3'
import Input from '../../components/Input'

const styles = {
  container: {
    padding: '0 2em 2em',
    overflow: 'hidden',
  },
}

const Methods = styled.div`
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;

  & > div {
    margin: 0.5em;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;

    & > div {
      min-width: 30%;
    }
  }
`
class UDapp extends Component {
  // TODO: use props to determine rendering
  componentWillReceiveProps(newProps) {}

  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L310
  renderMethod(method, contract) {
    return (
      <div key={method.name}>
        <h4>{`${method.name}`}</h4>

        {method.inputs.map((input, ind) => (
          <form
            key={input.name + ind + method.name}
            onSubmit={e => this.props.hocCall(e, method, contract)}
          >
            {input.name !== '_data' ? (
              <Input
                id={input.name}
                placeholder={
                  input.name === '_voter'
                    ? `${this.props.account}`
                    : `${input.name} (${input.type})`
                }
                onChange={e => this.props.hocInputChange(e, method, input)}
              />
            ) : (
              false
            )}
          </form>
        ))}
        {method.constant ? (
          <Button onClick={e => this.props.hocCall(e, method, contract)}>
            {'Call'}
          </Button>
        ) : (
          <Button
            onClick={e => this.props.hocSendTransaction(method, contract)}
          >
            {'Send Transaction'}
          </Button>
        )}
        {method.constant && this.props.currentMethod === method.name
          ? ` -> ${this.props.callResult}`
          : false}
        <br />
        <br />
      </div>
    )
  }

  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L205
  render() {
    console.log('UDAPP props:', this.props)

    const registryMethodsWithArgs = (this.props.registry.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' && methodInterface.inputs.length > 0
    )
    const visibleRegistryMethods = registryMethodsWithArgs.filter(
      methodInterface => this.props.actions.includes(methodInterface.name)
    )

    const tokenMethodsWithArgs = (this.props.token.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' && methodInterface.inputs.length > 0
    )
    const visibleTokenMethods = tokenMethodsWithArgs.filter(methodInterface =>
      this.props.actions.includes(methodInterface.name)
    )

    const votingMethodsWithArgs = (this.props.voting.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' && methodInterface.inputs.length > 0
    )
    const visibleVotingMethods = votingMethodsWithArgs.filter(methodInterface =>
      this.props.actions.includes(methodInterface.name)
    )

    return (
      <div style={styles.container}>
        <Methods>
          <div>
            {visibleRegistryMethods.map(one =>
              this.renderMethod(one, 'registry')
            )}
          </div>
          <span>
            <hr />
          </span>
          <div>
            {visibleTokenMethods.map(one => this.renderMethod(one, 'token'))}
          </div>
          <span>
            <hr />
          </span>
          <div>
            {visibleVotingMethods.map(one => this.renderMethod(one, 'voting'))}
          </div>
        </Methods>
      </div>
    )
  }
}

export default UDappHOC(UDapp)
