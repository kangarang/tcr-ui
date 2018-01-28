import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { List } from 'immutable'
import UDapp from '../UDapp'

import { colors } from '../../components/Colors'
import H2 from '../../components/H2'
import Button from '../../components/Button'
import { TopBar } from '../../App'

const Wrapper = styled.div`
  padding: 1em;
`
const ModalMessage = styled.div`
  padding: 0 2em 2em;
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
    top: '5vh',
    left: '15vw',
    right: '15vw',
    maxWidth: '1300px',
    margin: '0 auto',
    backgroundColor: `${colors.greyBg}`,
    boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.2)',
    zIndex: '5',
    borderRadius: '10px',
    overflow: 'hidden',
  },
}

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: props.isOpen,
    }
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps', newProps)
    if (List.isList(newProps.actions) && !List.isList(this.props.actions)) {
      this.setState({
        modalIsOpen: true,
      })
    }
  }

  handleOpenModal = () => {
    console.log('Open UDAPP MODAL!')
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
          <TopBar />
          <H2>{this.props.messages.heading}</H2>
          {this.props.messages.default ? (
            <ModalMessage>{this.props.messages.default}</ModalMessage>
          ) : (
            false
          )}
          {this.props.messages.instructions ? (
            <ModalMessage>{this.props.messages.instructions}</ModalMessage>
          ) : (
            false
          )}

          <UDapp
            {...this.props}
          />
        </ReactModal>

        <Button onClick={this.handleOpenModal}>{`UDAPP - ${
          this.props.messages.name
        }`}</Button>
      </Wrapper>
    )
  }
}

export default Modal
