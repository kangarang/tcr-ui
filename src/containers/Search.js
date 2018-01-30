import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import Modal from './Modal'
import messages from '../messages'

import H2 from '../components/H2'
import UserInfo from '../components/UserInfo'

import Listing from '../components/Listing'
import FlexContainer from '../components/FlexContainer'
import Section from '../components/Section'

import {
  selectWallet,
  selectWhitelist,
  selectError,
  selectAccount,
  selectContracts,
} from '../selectors'
import methods from '../methods'

const SearchWrapper = styled.div`
  padding: 1em;
`

class Search extends Component {
  componentDidMount() {
    console.log('search props', this.props)
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  render() {
    const { wallet, account, whitelist, error, contracts } = this.props

    return (
      <SearchWrapper>
        <UserInfo account={account} error={error} wallet={wallet} contracts={contracts} />

        <Modal
          isOpen={false}
          messages={messages.search}
          account={account}
          actions={methods.challenge.actions}
          networkId={wallet.get('network')}
          wallet={wallet}
        />

        <H2>
          {'Registry ('}
          {whitelist.size}
          {')'}
        </H2>
        <FlexContainer>
          {whitelist.size > 0 &&
            whitelist.map(log => (
              <Section key={log.get('listing')}>
                <Listing
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}
                />
              </Section>
            ))}
        </FlexContainer>
      </SearchWrapper>
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
  whitelist: selectWhitelist,
  error: selectError,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Search))
