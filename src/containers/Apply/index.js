import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import Modal from '../Modal'
import messages from '../../config/messages'
import methods from '../../config/methods'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Event from '../../components/Event'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import { setupEthereum } from '../../actions'

import {
  selectError,
  selectAccount,
  selectCandidates,
  selectParameters,
  selectWallet,
  selectContracts,
} from '../../selectors'

const ApplyWrapper = styled.div`
  padding: 1em;
`

class Apply extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    console.log('Apply props:', this.props)
    // this.props.onSetupEthereum()
  }

  selectNetwork(network) {
    // this.props.onSetupEthereum(network)
  }

  render() {
    const { error, account, parameters, contracts, wallet } = this.props

    return (
      <ApplyWrapper>
        <UserInfo
          account={account}
          error={error}
          onSelectNetwork={this.selectNetwork}
          contracts={contracts}
          wallet={wallet}
        />
        <Modal
          isOpen={true}
          messages={messages.apply}
          actions={methods.apply.actions}
        />

      </ApplyWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  account: selectAccount,
  parameters: selectParameters,
  wallet: selectWallet,
  contracts: selectContracts,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Apply)
