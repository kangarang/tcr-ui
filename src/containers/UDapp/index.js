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
import Nav from '../Nav'

import H1 from '../../components/H1'
import UDappHOC from './HOC'

import Button from '../../components/Button'
// import { colors } from '../../components/Colors'
import Input from './components/Input.js'
// import { trimDecimalsThree, toEther } from '../../libs/units'
import { config } from '../../config/index'
// import { changeSliderValue } from "../../actions";
// import { selectSliderValue } from '../../selectors/udapp';

const styles = {
  container: {
    padding: '0 1em',
    overflow: 'hidden'
  }
}

const createSliderWithTooltip = Slider.createSliderWithTooltip
const SliderTT = createSliderWithTooltip(Slider)
const Handle = Slider.Handle

const Methods = styled.div`
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;

  & > div {
    margin: .5em;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;
  }
`
class UDapp extends Component {

  // TODO: use props to determine rendering
  componentWillReceiveProps(newProps) {
  }

  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L310
  renderMethod(method, contract) {
    // const inputs = method.inputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    // const outputs = method.outputs.map(arg => `${arg.type} ${arg.name}`).join(', ')
    return (
      <div key={method.name}>
        <h4>{`${method.name}`}</h4>

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

  handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
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
    const registryMethods = (this.props.registry.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const registryMethodsWithArgs = registryMethods.filter((methodInterface) => methodInterface.inputs.length > 0)

    const tokenMethods = (this.props.token.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const tokenMethodsWithArgs = tokenMethods.filter((methodInterface) => methodInterface.inputs.length > 0)

    const votingMethods = (this.props.voting.abi || []).filter((methodInterface) => methodInterface.type === 'function')
    const votingMethodsWithArgs = votingMethods.filter((methodInterface) => methodInterface.inputs.length > 0)

    return (
      <div style={styles.container}>
        <H1 className="UDapp-title">U D A P P</H1>

        <SliderTT
          min={1}
          max={this.props.tokenBalance ? Number(this.props.tokenBalance) : 100}
          defaultValue={420}
          handle={this.handle}
          tipFormatter={value => `${value} ${config.tokenSymbol}`}
          onChange={this.props.onChangeSliderValue}
        />

        <Methods>

          REGISTRY:
            {this.props.registry.address}
          <div>
            {registryMethodsWithArgs.map((one) => one.constant ? false : this.renderMethod(one, 'registry'))}
            {/* {registryMethodsWithArgs.map((one) => this.renderMethod(one, 'registry'))} */}
          </div>

          TOKEN:
            {this.props.token.address}
          <div>
            {tokenMethodsWithArgs.map((one) => one.constant ? false : this.renderMethod(one, 'token'))}
            {/* {tokenMethodsWithArgs.map((one) => this.renderMethod(one, 'token'))} */}
          </div>

          VOTING:
            {this.props.voting.address}
          <div>
            {/* {votingMethodsWithArgs.map((one) => one.constant ? false : this.renderMethod(one, 'voting'))} */}
            {votingMethodsWithArgs.map((one) => this.renderMethod(one, 'voting'))}
          </div>

        </Methods>

        <Nav />
      </div>
    )
  }
}

export default UDappHOC(UDapp)