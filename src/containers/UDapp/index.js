import React, { Component } from 'react'
import styled from 'styled-components'
import { List } from 'immutable'

import UDappHOC from './HOC'

import Button from '../../components/Button'
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
  componentWillReceiveProps(newProps) {
    console.log('UDAPP newProps', newProps)
  }

  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L310
  renderMethod(method, contract) {
    return (
      <div key={method.name}>
      {/* <OneThird> */}

        <h4>{`${method.name}`}</h4>
      {/* </OneThird>
      <TwoThirds>

      </TwoThirds> */}

        {method.inputs.map((input, ind) => (
          <form
            key={input.name + ind + method.name}
            onSubmit={e => this.props.hocCall(e, method, contract)}
          >
            {input.name !== '_data' ? (
              // TODO: enable so that the defaultValue actually works without
              // ...having to re-input
              <Input
                id={input.name}
                placeholder={`${input.name} (${input.type})`}
                defaultValue={
                  List.isList(this.props.actions)
                    ? // : `${this.props.customArgs}`
                      'custom argssss'
                    : input.name === '_voter' || input.name === '_owner'
                      ? `${this.props.account}`
                      : ''
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
            <div>{'ACCOUNT: ' + this.props.account}</div>
            <div>{'REGISTRY: ' + this.props.registry.address}</div>
            <div>{'TOKEN: ' + this.props.token.address}</div>
            <div>{'VOTING: ' + this.props.voting.address}</div>
          </div>
          <span>
            <hr />
          </span>
          <div>
            {visibleRegistryMethods.map(one =>
              this.renderMethod(one, 'registry')
            )}
          </div>
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
