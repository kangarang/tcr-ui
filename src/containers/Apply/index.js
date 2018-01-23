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

import {
  setupEthereum,
} from '../../actions'

import {
  selectError,
  selectAccount,
  selectCandidates,
  selectParameters,
  selectWallet,
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
      error,
      account,
      candidates,
      parameters,
      wallet,
    } = this.props

    return (
      <ApplyWrapper>
        <Modal isOpen={true} messages={messages.apply} actions={methods.apply.actions} />

        <UserInfo
          network={wallet.get('network')}
          account={account}
          error={error}
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn(['token', 'allowances', 'registry', 'total'])}
          onSelectNetwork={this.selectNetwork}
        />

        <H2>{'Applicants ('}{candidates.size}{')'}</H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('listing')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}
                />
              </Section>
            ))}
        </FlexContainer>
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
  error: selectError,
  account: selectAccount,
  candidates: selectCandidates,
  parameters: selectParameters,
  wallet: selectWallet,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Apply)

