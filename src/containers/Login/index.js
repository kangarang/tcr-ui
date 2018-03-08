import React, { Component } from 'react'
import ReactModal from 'react-modal'

import Img from 'components/Img'
import Button from 'components/Button'
import Input from 'components/Input'
import TopGradient from 'components/TopGradient'
import { trimDecimalsThree, toEther, withCommas } from 'utils/_units'

import { colors } from '../../colors'

import {
  Wrapper,
  PaddedDiv,
  RightPaddedDiv,
  LrgDiv,
  SmlDiv,
  SmlBoldDiv,
} from './components/StyledLoginComponents'

const modalStyles = {
  overlay: {
    position: 'absolute',
    padding: '2em 2em 1em',
    top: '0',
    left: '0',
    right: '0',
    bottom: '10vh',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: '2',
  },
  content: {
    position: 'absolute',
    top: '5vh',
    left: '25vw',
    right: '25vw',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: `${colors.offWhite}`,
    boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.2)',
    zIndex: '5',
    borderRadius: '6px',
    overflow: 'hidden',
  },
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
    }
  }

  handleOpenModal = () => {
    console.log('open modal event')
    this.setState({
      modalIsOpen: true,
    })

    // console.log('this.props.ns()', this.props.ns())
    // const nsState = this.props.ns().props.store.getState()
    // console.log('nsState', nsState)
  }

  handleCloseModal = () => {
    console.log('close modal event')
    this.setState({
      modalIsOpen: false,
    })
  }

  handleMainAction = (e, mainMethod) => {
    console.log('mainMethod:', mainMethod)
    this.props.execute({
      method: mainMethod,
      account: this.props.account,
      network: this.props.network,
      registry: this.props.registryValue || this.props.registryPH,
    })
  }

  handleAfterOpen = () => {}

  handleRequestClose = () => {
    console.log('close', this)
    this.setState({
      modalIsOpen: false,
    })
  }

  render() {
    const {
      messages,
      account,
      ethBalance,
      imgSrc,
      // NetworkStatus,
      registryValue,
      onChange,
      registryPH,
      tokenBalance,
      tokenSymbol,
      tokenName,
      ecRecovered,
    } = this.props

    return (
      <Wrapper>
        <ReactModal
          isOpen={!ecRecovered || this.state.modalIsOpen}
          // isOpen={false}
          onAfterOpen={this.handleAfterOpen}
          onRequestClose={this.handleRequestClose}
          style={modalStyles}
          contentLabel="Login Modal"
          portalClassName="LoginModalPortal"
          overlayClassName="LoginModal__Overlay"
          className="LoginModal__Content"
          bodyOpenClassName="LoginModal__Body--open"
          ariaHideApp={false}
          shouldFocusAfterRender={false}
          shouldCloseOnEsc={true}
          shouldReturnFocusAfterClose={true}
          role="dialog"
        >
          <TopGradient />
          <Img wrapper={true} src={imgSrc} alt="Token Curated Registries" />

          <PaddedDiv>
            {/* <Icon iconName="user" /> */}
            <SmlBoldDiv>{'Account: '}</SmlBoldDiv>
            <LrgDiv>{account || messages.default}</LrgDiv>
          </PaddedDiv>

          <PaddedDiv>
            {/* <Icon iconName="globe" /> */}
            <SmlBoldDiv>{'Network: '}</SmlBoldDiv>
            {/* <SmlDiv>{NetworkStatus}</SmlDiv> */}
            <SmlBoldDiv>{'ETH Balance: '}</SmlBoldDiv>
            <SmlDiv>{trimDecimalsThree(toEther(ethBalance)) || '0'}</SmlDiv>
          </PaddedDiv>

          <PaddedDiv>
            {/* <Icon iconName="trendingUp" /> */}
            <SmlBoldDiv>{'Registry: '}</SmlBoldDiv>
            <LrgDiv>
              <Input
                placeholder={registryPH}
                value={registryValue || registryPH}
                onChange={onChange}
                noBorder={true}
              />
            </LrgDiv>
          </PaddedDiv>

          <PaddedDiv>
            {/* <Icon iconName="zap" /> */}
            <SmlBoldDiv>{'Token Name: '}</SmlBoldDiv>
            <SmlDiv>{tokenName}</SmlDiv>

            <SmlBoldDiv>
              {tokenSymbol}
              {' Balance: '}
            </SmlBoldDiv>
            <SmlDiv>{tokenBalance && withCommas(tokenBalance)}</SmlDiv>
          </PaddedDiv>

          <RightPaddedDiv>
            <Button
              onClick={e => this.handleMainAction(e, messages.mainMethod)}
            >
              {'CONFIRM ACCOUNT'}
            </Button>
          </RightPaddedDiv>
        </ReactModal>

        <Button onClck={this.handleOpenModal}>{messages.name}</Button>
      </Wrapper>
    )
  }
}

export default Login
