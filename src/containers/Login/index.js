import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'

import { colors } from '../../components/Colors'
import H2 from '../../components/H2'
import Img from '../../components/Img'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { trimDecimalsThree, toEther } from '../../libs/units'

const Wrapper = styled.div`
  /* position: absolute;
  top: 50;
  left: 50; */

  padding: 1em;
  /* border: 2px solid ${colors.darkBlue}; */
`
const Close = styled.div`
  position: absolute;
  top: .5em;
  right: .5em;
  padding: 1em;
  border: 1px solid ${colors.darkBlue};
`
const PaddedDiv = styled.div`
  padding: 1em;
  margin: 1em 5em;
  border: 1px solid ${colors.darkBlue};
`
const HalfDiv = styled.div`
  display: inline-block;
  overflow: hidden;
  width: 50%;
  /* border: 1px solid red; */
`
const LrgDiv = styled(HalfDiv)`
  width: 80%;
`
const SmlDiv = styled(HalfDiv)`
  width: 20%;
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

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: props.isOpen || false,
      action: props.action,
    }
  }

  handleOpenModal = () => {
    console.log('open modal event')
    this.setState({
      modalIsOpen: true,
    })
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
      registry: this.props.registryValue,
    })
  }

  handleAfterOpen = () => {
    console.log('open', this)
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
    } = this.props

    return (
      <Wrapper>
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.handleAfterOpen}
          onRequestClose={this.handleRequestClose}
          style={modalStyles}
          contentLabel="Notification Modal"
          portalClassName="NotificationModalPortal"
          overlayClassName="NotificationModal__Overlay"
          className="NotificationModal__Content"
          bodyOpenClassName="NotificationModal__Body--open"
          ariaHideApp={false}
          shouldFocusAfterRender={false}
          shouldCloseOnEsc={true}
          shouldReturnFocusAfterClose={true}
          role="dialog"
        >
          <Close onClick={this.handleCloseModal}>{'X'}</Close>

          <Img src={imgSrc} alt="Token Curated Registries" />

          <PaddedDiv>
            <SmlDiv>{'Account:'}</SmlDiv>
            <LrgDiv>{account || messages.default}</LrgDiv>
          </PaddedDiv>

          <PaddedDiv>
            <SmlDiv>{'ΞTH Balance:'}</SmlDiv>
            <HalfDiv>{trimDecimalsThree(toEther(ethBalance)) || '0'}</HalfDiv>
          </PaddedDiv>

          <PaddedDiv>
            <HalfDiv>{'Network:'}</HalfDiv>
            <HalfDiv>{networkStatus}</HalfDiv>
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

          <PaddedDiv>{messages.default}</PaddedDiv>
          <Button onClick={e => this.handleMainAction(e, messages.mainMethod)}>
            {'CONFIRM ACCOUNT '}
          </Button>
        </ReactModal>

        <Button onClick={this.handleOpenModal}>{messages.name}</Button>
      </Wrapper>
    )
  }
}

export default Modal
