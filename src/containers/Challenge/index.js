import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import Modal from '../Modal'
import messages from '../../config/messages'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Event from '../../components/Event'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import {
  selectWallet,
  selectCandidates,
  selectError,
  selectAccount,
  selectContracts,
} from '../../selectors'
import methods from '../../config/methods'

const ChallengeWrapper = styled.div`
  padding: 1em;
`

class Challenge extends Component {
  componentDidMount() {
    console.log('challenge props', this.props)
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  render() {
    const { wallet, account, candidates, error, contracts } = this.props

    return (
      <ChallengeWrapper>
        <UserInfo
          account={account}
          error={error}
          wallet={wallet}
          contracts={contracts}
        />

        <Modal
          isOpen={false}
          messages={messages.challenge}
          account={account}
          actions={methods.challenge.actions}
          networkId={wallet.get('network')}
          wallet={wallet}
        />

        <H2>
          {'Applicants ('}
          {candidates.size}
          {')'}
        </H2>
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
      </ChallengeWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const mapStateToProps = createStructuredSelector({
  wallet: selectWallet,
  contracts: selectContracts,
  account: selectAccount,
  candidates: selectCandidates,
  error: selectError,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Challenge))
