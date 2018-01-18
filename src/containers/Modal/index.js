import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import Apply from '../Apply'

import { colors } from '../../components/Colors'
import H2 from '../../components/H2'

const Wrapper = styled.div`
  /* position: absolute;
  top: 50;
  left: 50;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  width: 40vw;
  padding: 2em;
  border: 2px solid ${colors.darkBlue}; */
`
// ReactModal.setAppElement(Apply)

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: '10vh',
    left: '25vw',
    right: '25vw',
    bottom: '25vh',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    border: '1px solid black',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    border: '1px solid red',
  },
}

class Modal extends Component {
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
          /*
          Boolean indicating if the appElement should be hidden
          */
          ariaHideApp={true}
          shouldFocusAfterRender={false}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={true}
          shouldReturnFocusAfterClose={true}
          role="dialog"
          parentSelector={() => document.body}

          /*
          Additional aria attributes (optional).
          */
          // aria={{
          //   labelledby: 'heading',
          //   describedby: 'full_description',
          // }}
        >
          <H2>NotificationModal</H2>
          <div onClick={this.handleCloseModal}>Close Modal</div>
        </ReactModal>

        <div onClick={this.handleOpenModal}>Open Modal</div>
      </Wrapper>
    )
  }
}

export default Modal
