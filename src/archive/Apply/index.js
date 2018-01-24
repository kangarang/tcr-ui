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
  render() {
    return (
      <ApplyWrapper>
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
