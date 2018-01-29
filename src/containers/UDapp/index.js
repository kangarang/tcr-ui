import React, { Component } from 'react'
import styled from 'styled-components'
import { List } from 'immutable'

import UDappHOC from './HOC'

import Button from '../../components/Button'
import Input from '../../components/Input'

import {
  BoldInlineText,
} from '../../components/Item'
import { withCommas, trimDecimalsThree } from '../../libs/units'

const BigContainer = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr;
`
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 5px;
  border: 3px solid #${props => props.bgColor && props.bgColor.slice(-6)};
  border-radius: 4px;
`
export const Item = styled.div`
  padding: 0.7em;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
`
const styles = {
  container: {
    padding: '0 2em 2em',
    overflow: 'hidden',
  },
  udappMethod: {
    width: '33%',
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
      <div key={method.name} style={styles.udappMethod}>
        <h4>{`${method.name}`}</h4>
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
            {'CALL'}
          </Button>
        ) : (
          <Button
            onClick={e => this.props.hocSendTransaction(method, contract)}
          >
            {'SEND TXN'}
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
    const tokenBalance =
      this.props.wallet && this.props.wallet.getIn(['token', 'tokenBalance'])
    const votingRights =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.voting.address,
        'votingRights',
      ])
    const votingAllowance =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.voting.address,
        'total',
      ])
    const registryAllowance =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.registry.address,
        'total',
      ])
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
            <BigContainer>
              <Container bgColor={this.props.token.address}>
                <Item gR={1}>
                  <BoldInlineText>
                    {'Token Balance: '}
                    {tokenBalance &&
                      withCommas(trimDecimalsThree(tokenBalance))}
                  </BoldInlineText>
                </Item>
                <Item gR={2}>
                  {visibleTokenMethods.map(one =>
                    this.renderMethod(one, 'token')
                  )}
                </Item>
              </Container>

              <Container bgColor={this.props.registry.address}>
                <Item gR={1}>
                  <BoldInlineText>
                    {'REGISTRY: ' + this.props.registry.address}
                  </BoldInlineText>
                </Item>
                <Item gR={2}>
                  <BoldInlineText>
                    {`Allowance: `}
                    {registryAllowance && withCommas(registryAllowance)}
                  </BoldInlineText>
                </Item>
                <Item gR={3}>
                  {visibleRegistryMethods.map(one =>
                    this.renderMethod(one, 'registry')
                  )}
                </Item>
              </Container>

              <Container bgColor={this.props.voting.address}>
                <Item gR={1}>
                  <BoldInlineText>
                    {'VOTING: ' + this.props.voting.address}
                  </BoldInlineText>
                </Item>
                <Item gR={2}>
                  <BoldInlineText>
                    {'Allowance: '}
                    {votingAllowance && withCommas(votingAllowance)}
                  </BoldInlineText>
                </Item>
                <Item gR={3}>
                  <BoldInlineText>
                    {'Voting Rights: '}
                    {votingRights && withCommas(votingRights)}
                  </BoldInlineText>
                </Item>
                <Item gR={4}>
                  {visibleVotingMethods.map(one =>
                    this.renderMethod(one, 'voting')
                  )}
                </Item>
              </Container>
            </BigContainer>
            {/* <Item gR={5} gC={4}>
        <BoldInlineText>
          {'Voting Balance: '}
          {votingBalance && withCommas(votingBalance)}
        </BoldInlineText>
      </Item>
      <Item gR={6} gC={4}>
        <BoldInlineText>
          {'Locked Tokens: '}
          {lockedTokens && withCommas(lockedTokens)}
        </BoldInlineText>
      </Item> */}
          </div>
        </Methods>
      </div>
    )
  }
}

export default UDappHOC(UDapp)
