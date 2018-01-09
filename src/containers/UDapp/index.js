import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Identicon from '../../components/Identicon'
import {colors} from '../../components/Colors'

import {
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from '../../components/Item'
import {
  selectAddress,
  selectFromAddress,
  selectDeposit,
  selectValues,
  selectDomain,
  selectTokenBalance,
  selectEthBalance,
  selectProvider,
} from '../../selectors/udapp';

import {
  toEther,
  withCommas,
  trimDecimalsThree,
} from '../../libs/units'

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
  grid-template-rows: 2fr 2fr 5fr 2fr 2fr;
  grid-gap: 10px;
  padding: 1em;
  background-color: ${colors.offBlack};
  color: ${colors.prism};
  border: 2px solid ${colors.prism};
`

const Item = styled.div`
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: flex-start; */
  /* grid-row: ${(props) => props.gR}; */
  /* grid-column: ${(props) => props.gC}; */
  /* padding: ${(props) => props.pad && props.pad + 'em'}; */
  overflow: hidden;
`

class UDapp extends Component {
  componentDidMount() {
    // this.props.onSetupEthereum()
  }
  render() {
    const {
      ethBalance,
      provider,
      deposit,
      domain,
      address,
      fromAddress,
      tokenBalance,
    } = this.props
    // const events = (appState.abi || []).filter((interface) => interface.type === 'event')
    // const methods = (appState.abi || []).filter((interface) => interface.type === 'function')
    // const methodsWithNoArgs = methods.filter((interface) => interface.inputs.length === 0)
    // const methodsWithArgs = methods.filter((interface) => interface.inputs.length > 0)
    // const eventStream = appState.eth.logs || []
    
    return (
      <Container>

        <Item gR={1} gC={2}>
          <BigBoldInlineText>{'Token-Curated Registries'}</BigBoldInlineText>
        </Item>

        <Item gR={2} gC={2}>
          <BoldInlineText>
            {'Account: '}
            {fromAddress}
          </BoldInlineText>
        </Item>
        <Item gR={1} gC={3}>
          <BoldInlineText>
            {'ΞTH Balance: '}
            {trimDecimalsThree(toEther(ethBalance))}
          </BoldInlineText>
        </Item>

        <Item gR={1} gC={4}>
          <BoldInlineText>
            {'CATT Balance: '}
            {withCommas(tokenBalance)}
          </BoldInlineText>
        </Item>

        <FlexCenteredItem gR={2} gC={1}>
          <Identicon owner={fromAddress} size={6} scale={6} />
        </FlexCenteredItem>


      </Container>
    )
  }
}

UDapp.propTypes = {
  // address: PropTypes.string,
  // network: PropTypes.string,
  // onApprove: PropTypes.func,
  // tokenBalance: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  // tokensAllowed: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  // ethBalance: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

function mapDispatchToProps(dispatch) {
  return {
    // onSetupEthereum: () => dispatch(setupEthereum()),
    // onApprove: amount => dispatch(requestApproval(amount)),
    // onApply: (domain, deposit) => dispatch(applyDomain(domain, deposit)),
    // onChallenge: domain => dispatch(challengeDomain(domain)),
    // onCommitVote: (domain, pollID, amount) => dispatch(commitVote(domain, pollID, amount)),
    // onUpdateStatus: domain => dispatch(updateStatus(domain)),
    // onTest: domain => dispatch(checkTest(domain)),
  }
}

const mapStateToProps = createStructuredSelector({
  address: selectAddress,
  fromAddress: selectFromAddress,
  ethBalance: selectEthBalance,
  tokenBalance: selectTokenBalance,
  domain: selectDomain,
  values: selectValues,
  provider: selectProvider,
  deposit: selectDeposit,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(UDapp)
