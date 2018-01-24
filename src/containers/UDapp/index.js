import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { compose } from 'redux'
// import { createStructuredSelector } from 'reselect'

// import Eth from 'ethjs'
import styled from 'styled-components'

import Slider from 'rc-slider'
import Tooltip from 'rc-tooltip'

import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'

import UDappHOC from './HOC'

import Button from '../../components/Button'
import H3 from '../../components/H3'
// import { colors } from '../../components/Colors'
import Input from './components/Input.js'
// import { trimDecimalsThree, toEther } from '../../libs/units'
// import { changeSliderValue } from "../../actions";
// import { selectSliderValue } from '../../selectors/udapp';

const styles = {
  container: {
    padding: '0 1em',
    overflow: 'hidden',
  },
}

// const createSliderWithTooltip = Slider.createSliderWithTooltip
// const SliderTT = createSliderWithTooltip(Slider)
const Handle = Slider.Handle

const Methods = styled.div`
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;

  & > div {
    margin: 0.5em;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;
  }
`
class UDapp extends Component {
  // TODO: use props to determine rendering
  componentWillReceiveProps(newProps) {}

  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L310
  renderMethod(method, contract, action = false) {
    return (
      <div key={method.name}>
        <h4>{`${method.name}`}</h4>

        {method.inputs.map((input, ind) => (
          <form
            key={input.name + ind}
            onSubmit={e => this.props.hocCall(e, method, contract)}
          >
            <Input
              id={input.name}
              placeholder={`${input.name} (${input.type})`}
              onChange={e => this.props.hocInputChange(method, e, ind, input)}
            />
          </form>
        ))}

        {method.constant ? (
          <Button onClick={e => this.props.hocCall(e, method, contract)}>
            {'Call'}
          </Button>
        ) : (
          <Button
            onClick={e => this.props.hocSendTransaction(e, method, contract)}
          >
            {'Send Transaction'}
          </Button>
        )}
        <br />
        <br />
      </div>
    )
  }

  handle = props => {
    const { value, dragging, index, ...restProps } = props
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
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

    // TODO: filter methods based on actions
    return (
      <div style={styles.container}>
        {/* <SliderTT
          min={1}
          max={this.props.tokenBalance ? Number(this.props.tokenBalance) : 100}
          defaultValue={420}
          handle={this.handle}
          tipFormatter={value => `${value} ${config.tokenSymbol}`}
          onChange={this.props.onChangeSliderValue}
        /> */}
        <H3>CALL RESULT: {this.props.callResult}</H3>
        <div>ACCOUNT: {this.props.account}</div>
        <br />
        <Methods>
          <span>
            {'REGISTRY: '}
            {this.props.registry.address}
          </span>
          <div>
            {visibleRegistryMethods.map(one =>
              this.renderMethod(one, 'registry')
            )}
          </div>

          <span>
            {'TOKEN: '}
            {this.props.token.address}
          </span>
          <div>
            {visibleTokenMethods.map(one => this.renderMethod(one, 'token'))}
          </div>

          <span>
            {'VOTING: '}
            {this.props.voting.address}
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
