import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'

import { colors } from '../../components/Colors'
import H2 from '../../components/H2'
import Img from '../../components/Img'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { trimDecimalsThree, toEther, withCommas } from '../../libs/units'

const Wrapper = styled.div`
  padding: 1em;
`
const PaddedDiv = styled.div`
  padding: 1em;
  margin: 1em 5em;
  border: 1px solid ${colors.darkBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const RightPaddedDiv = styled(PaddedDiv)`
  border: none;
  justify-content: flex-end;
`
const HalfDiv = styled.div`
  display: inline-block;
  overflow: hidden;
  width: 50%;
`
const LrgDiv = styled(HalfDiv)`
  min-width: 85%;
  margin: 0 1%;
`
const SmlDiv = styled(HalfDiv)`
  min-width: 13%;
  margin: 0 1%;
`

const modalStyles = {
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: '2',
  },
  content: {
    position: 'absolute',
    padding: '3em',
    top: '10vh',
    left: '10vw',
    right: '10vw',
    margin: '0 auto',
    maxWidth: '800px',
    backgroundColor: `${colors.offWhite}`,
    boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.2)',
    zIndex: '5',
    borderRadius: '6px',
  },
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: props.isOpen,
    }
    console.log('this', this)
  }

  handleOpenModal = () => {
    console.log('open modal event')
    this.setState({
      modalIsOpen: true,
    })

    console.log('this.props.ns()', this.props.ns())
    const nsState = this.props.ns().props.store.getState()
    console.log('nsState', nsState)
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

  handleAfterOpen = () => {
  }

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
      network,
      networkStatus,
      registryValue,
      execute,
      onChange,
      registryPH,
      tokenBalance,
      tokenSymbol,
      tokenName,
    } = this.props

    return (
      <Wrapper>
        <ReactModal
          isOpen={this.state.modalIsOpen}
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
          <Button onClick={this.handleCloseModal}>{'X'}</Button>

          <Img src={imgSrc} alt="Token Curated Registries" />

          <PaddedDiv>
            <SmlDiv>{'Account:'}</SmlDiv>
            <LrgDiv>{account || messages.default}</LrgDiv>
          </PaddedDiv>

          <PaddedDiv>
            <SmlDiv>{'Network:'}</SmlDiv>
            <SmlDiv>{networkStatus}</SmlDiv>
            <SmlDiv>{'ΞTH Balance:'}</SmlDiv>
            <SmlDiv>{trimDecimalsThree(toEther(ethBalance)) || '0'}</SmlDiv>
          </PaddedDiv>

          <PaddedDiv>
            <SmlDiv>{'Registry:'}</SmlDiv>
            <LrgDiv>
              <Input
                placeholder={registryPH}
                value={registryValue || registryPH}
                onChange={onChange}
              />
            </LrgDiv>
          </PaddedDiv>

          <PaddedDiv>
            <SmlDiv>{'Token Name:'}</SmlDiv>
            <SmlDiv>{tokenName}</SmlDiv>
            <SmlDiv>{tokenSymbol}{' Balance:'}</SmlDiv>
            <SmlDiv>{tokenBalance && withCommas(tokenBalance)}</SmlDiv>
          </PaddedDiv>

          <RightPaddedDiv>
            <Button
              onClick={e => this.handleMainAction(e, messages.mainMethod)}
            >
              {'CONFIRM ACCOUNT '}
            </Button>
          </RightPaddedDiv>
        </ReactModal>

        <Button onClick={this.handleOpenModal}>{messages.name}</Button>
      </Wrapper>
    )
  }
}

export default Login