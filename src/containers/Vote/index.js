import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import {withRouter} from "react-router-dom"

import Modal from '../Modal'
import messages from '../../config/messages'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Event from '../../components/Event'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import {
  selectParameters,
  selectWallet,
  selectFaceoffs,
  selectError,
  selectAccount,
  selectContracts,
} from '../../selectors'
import methods from '../../config/methods';
import { handleActionClick } from '../../actions/index';

const VotingWrapper = styled.div`
  padding: 1em;
`

class Voting extends Component {
  componentDidMount() {
    console.log('Voting props', this.props)
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  render() {
    const {
      wallet,
      account,
      contracts,
      faceoffs,
      error,
      onHandleClick,
    } = this.props

    return (
      <VotingWrapper>
        <UserInfo
          account={account}
          error={error}
          wallet={wallet}
          contracts={contracts}
        />

        <Modal messages={messages.voting} account={account} actions={methods.voting.actions} />

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
                  handleClick={onHandleClick}
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
    onHandleClick: (p) => dispatch(handleActionClick('commitVote', p))
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  faceoffs: selectFaceoffs,
  error: selectError,
  contracts: selectContracts,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Voting))

