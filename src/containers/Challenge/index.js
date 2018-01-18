import React, { Component } from 'react'
import Modal from '../Modal'
import messages from '../../messages'

class Challenge extends Component {

  render() {
    return (
      <div>
        <Modal messages={messages.challenge} />
      </div>
    )
  }
}

export default Challenge 