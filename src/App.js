import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import UDappHOC from './HOC/UDapp'

import H2 from './components/H2'
import UserInfo from './components/UserInfo'

import Event from './components/Event'
import FlexContainer from './components/FlexContainer'
import Section from './components/Section'

import './global-styles'

import {
  setupEthereum,
} from './actions'

import {
  selectParameters,
  selectWallet,
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectAccount,
} from './selectors'

class App extends Component {
  constructor() {
    super()
    this.state = {
      listing: '',
    }
  }

  componentDidMount() {
    console.log('App props:', this.props)
    this.props.onSetupEthereum()
  }

  render() {
    const {
      wallet,
      account,
      candidates,
      faceoffs,
      whitelist,
      parameters,
    } = this.props

    return (
      <div>

        <UserInfo
          network={parameters.get('network')}
          account={account}
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn(['token', 'allowances', 'registry', 'total'])}
          onApprove={this.handleApprove}
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

        <H2>{'Registry ('}{whitelist.size}{')'}</H2>
        <FlexContainer>
          {whitelist.size > 0 &&
            whitelist.map(log => (
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
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: () => dispatch(setupEthereum()),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  whitelist: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(UDappHOC(App))
