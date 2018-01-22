import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import Modal from '../Modal'
import messages from '../../messages'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Event from '../../components/Event'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import {
  setupEthereum,
} from '../../actions'

import {
  selectParameters,
  selectWallet,
  selectError,
  selectAccount,
  selectAllListings,
} from '../../selectors'

const ApplyWrapper = styled.div`
  padding: 1em;
`

class Apply extends Component {
  constructor() {
    super()
    this.state = {
      listing: '',
    }
  }

  componentDidMount() {
    console.log('Apply props:', this.props)
    this.props.onSetupEthereum('ganache')
  }

  selectNetwork(network) {
    this.props.onSetupEthereum(network)
  }

  render() {
    const {
      account,
      error,
      listings,
      parameters,
      wallet,
    } = this.props

    return (
      <ApplyWrapper>
        <Modal messages={messages.apply} />

        <UserInfo
          network={wallet.get('network')}
          account={account}
          error={error}
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn(['token', 'allowances', 'registry', 'total'])}
          onSelectNetwork={this.selectNetwork}
        />
      </ApplyWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: (network) => dispatch(setupEthereum(network)),
  }
}

const mapStateToProps = createStructuredSelector({
  account: selectAccount,
  error: selectError,
  listings: selectAllListings,
  parameters: selectParameters,
  wallet: selectWallet,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Apply)

