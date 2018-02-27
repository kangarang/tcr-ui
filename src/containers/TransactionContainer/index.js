import React, { Component } from 'react'
import ReactModal from 'react-modal'

import { colors } from '../../colors'

import UDappHOC from './HOC'

import Method from './components/Method'
import Button from '../../components/Button'
import TopBar from '../../components/TopBar'

import {
  Container,
  Item,
  Wrapper,
  Methods,
} from './components/StyledItems'

import { withCommas, trimDecimalsThree } from '../../utils/units_utils'

const styles = {
  container: {
    padding: '0 2em 2em',
    overflow: 'hidden',
  },
}

const modalStyles = {
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: '2',
  },
  content: {
    position: 'absolute',
    top: '5vh',
    left: '5vw',
    right: '5vw',
    margin: '0 auto',
    // width: '1000px',
    // maxWidth: '1300px',
    maxWidth: '800px',
    backgroundColor: `${colors.greyBg}`,
    boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.2)',
    zIndex: '5',
    borderRadius: '10px',
    overflow: 'hidden',
  },
}

// adapted from:
// https://github.com/kumavis/udapp/blob/master/index.js#L205
class TransactionContainer extends Component {
  render() {
    const { tokenBalance, votingRights, votingAllowance, registryAllowance } = this.props

    const visibleRegistryMethods = (this.props.registry.contract ? this.props.registry.contract.abi : this.props.registry.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )
    const allTokenMethods = (this.props.token.contract ? this.props.token.contract.abi : this.props.token.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' && methodInterface.inputs.length > 0
    )
    const visibleTokenMethods = allTokenMethods.filter(meth =>
      this.props.actions.includes(meth.name)
    )
    const visibleVotingMethods = (this.props.voting.contract ? this.props.voting.contract.abi : this.props.voting.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )

    return (
      <div style={styles.container}>
        <Wrapper>
          <ReactModal
            isOpen={this.props.modalIsOpen}
            onRequestClose={this.props.closeModal}
            style={modalStyles}
            contentLabel="TransactionContainer Modal"
            portalClassName="UDappModalPortal"
            overlayClassName="UDappModal__Overlay"
            className="UDappModal__Content"
            bodyOpenClassName="UDappModal__Body--open"
            ariaHideApp={false}
            shouldFocusAfterRender={false}
            shouldCloseOnEsc={true}
            shouldReturnFocusAfterClose={true}
            shouldCloseOnOverlayClick={true}
            role="dialog"
          >
            <TopBar />

            <Methods>
              <div>
                <div>
                  {'Registry Address: ' + this.props.registry.address}
                </div>
                <div>
                  {'Token Address: ' + this.props.token.address}
                </div>
                <div>
                  {'Voting Address: ' + this.props.voting.address}
                </div>

                <hr />

                <div>
                  {'Token Balance: '}
                  {tokenBalance ? withCommas(trimDecimalsThree(tokenBalance)) : '0'}
                </div>
                <div>
                  {`Registry Allowance: `}
                  {registryAllowance ? withCommas(registryAllowance) : '0'}
                </div>
                <div>
                  {'Voting Allowance: '}
                  {votingAllowance ? withCommas(votingAllowance) : '0'}
                </div>
                <div>
                  {'Voting Rights: '}
                  {votingRights ? withCommas(votingRights) : '0'}
                </div>
              </div>

              <hr />

              {visibleTokenMethods.length > 0 && (
                <Container>
                  <Item gR={6}>
                    {visibleTokenMethods.map(one => (
                      <Method
                        key={`TokenMethod-${one.name}`}
                        method={one}
                        contract={'token'}
                        {...this.props}
                      />
                    ))}
                  </Item>
                </Container>
              )}

              {visibleRegistryMethods.length > 0 && (
                <Container>
                  <Item gR={3}>
                    {visibleRegistryMethods.map(one => (
                      <Method
                        key={`RegistryMethod-${one.name}`}
                        method={one}
                        contract={'registry'}
                        {...this.props}
                      />
                    ))}
                  </Item>
                </Container>
              )}

              {visibleVotingMethods.length > 0 && (
                <Container>
                  <Item gR={4}>
                    {visibleVotingMethods.map(one => (
                      <Method
                        key={`VotingMethod-${one.name}`}
                        method={one}
                        contract={'voting'}
                        {...this.props}
                      />
                    ))}
                  </Item>
                </Container>
              )}
            </Methods>

          </ReactModal>

          <Button onClick={this.props.openModal}>
            {this.props.messages.heading}
          </Button>
        </Wrapper>
      </div>
    )
  }
}

export default UDappHOC(TransactionContainer)
