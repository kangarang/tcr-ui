import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import UDapp from '../UDapp'
import messages from '../messages'
import methods from '../methods'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Listing from '../../components/Listing'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import { sendTransactionRequest, sendTransaction } from '../../actions'
import {
  selectWallet,
  selectWhitelist,
  selectError,
  selectAccount,
  selectContracts,
  selectEthjs,
  selectRequest,
} from '../../selectors'

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

  handleSendTransaction = e => {
    console.log('confirm txn:', e)
    this.props.onSendTransaction(e)
  }

  handleClick = e => {
    console.log('handle challenge click', e)
    this.props.onSendTransactionRequest(e)
  }

  render() {
    const { wallet, whitelist, request } = this.props

    const reqMeth = request.get('method') ? request.get('method') : 'search'
    const customMethods = methods[reqMeth].actions || []

    return (
      <SearchWrapper>
        <UserInfo {...this.props} />

        <UDapp
          isOpen={false}
          messages={messages.search}
          actions={customMethods}
          networkId={wallet.get('network')}
          handleSendTransaction={this.handleSendTransaction}
          {...this.props}
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
                  handleClick={this.handleClick}
                />
              </Section>
            ))}
        </FlexContainer>
      </SearchWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSendTransactionRequest: e => dispatch(sendTransactionRequest(e)),
    onSendTransaction: payload => dispatch(sendTransaction(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  wallet: selectWallet,
  contracts: selectContracts,
  account: selectAccount,
  whitelist: selectWhitelist,
  error: selectError,
  ethjs: selectEthjs,
  request: selectRequest,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Search))
