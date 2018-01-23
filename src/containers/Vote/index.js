import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import Modal from '../Modal'
import messages from '../../config/messages'

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
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectError,
  selectAccount,
  selectAllListings,
  selectContracts,
} from '../../selectors'
import methods from '../../config/methods';

const VotingWrapper = styled.div`
  padding: 1em;
`

class Voting extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    console.log('Voting props:', this.props)
  }

  selectNetwork(network) {
  }

  render() {
    const {
      wallet,
      account,
      contracts,
      candidates,
      faceoffs,
      whitelist,
      parameters,
      match,
      error,
    } = this.props

    return (
      <VotingWrapper>
        <UserInfo
          account={account}
          error={error}
          onSelectNetwork={this.selectNetwork}
          wallet={wallet}
          contracts={contracts}
        />

        <Modal messages={messages.voting} actions={methods.voting.actions} />

        <H2>{'Challenges ('}{faceoffs.size}{')'}</H2>
        <FlexContainer>
          {faceoffs.size > 0 &&
            faceoffs.map(log => (
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
      </VotingWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  error: selectError,
  contracts: selectContracts,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Voting)

