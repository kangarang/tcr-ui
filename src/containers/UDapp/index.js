import React, { Component } from 'react'
import ReactModal from 'react-modal'

import { colors } from '../../colors'

import UDappHOC from './HOC'

import H2 from '../../components/H2'
import Method from './components/Method'
import Button from '../../components/Button'
import TopBar from '../../components/TopBar'
import {
  BoldInlineText,
  Text,
  FourItemGridContainer,
} from '../../components/Item'

import {
  BigContainer,
  Container,
  Item,
  Wrapper,
  ModalMessage,
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
class UDapp extends Component {
  render() {
    const tokenBalance =
      this.props.wallet && this.props.wallet.getIn(['token', 'tokenBalance'])
    const votingRights =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.voting.address,
        'votingRights',
      ])
    const votingAllowance =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.voting.address,
        'total',
      ])
    const registryAllowance =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.registry.address,
        'total',
      ])

    const visibleRegistryMethods = (this.props.registry.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )
    const allTokenMethods = (this.props.token.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' && methodInterface.inputs.length > 0
    )
    const visibleTokenMethods = allTokenMethods.filter(meth =>
      this.props.actions.includes(meth.name)
    )
    const warningTokenMethods = allTokenMethods.filter(meth =>
      this.props.warnings.includes(meth.name)
    )
    const visibleVotingMethods = (this.props.voting.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )

    return (
      <div style={styles.container}>
        <Wrapper>
          <ReactModal
            isOpen={this.props.modalIsOpen === this.props.default}
            onRequestClose={this.props.closeModal}
            style={modalStyles}
            contentLabel="UDapp Modal"
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
                <BigContainer>
                  <Container>
                    {this.props.prerequisites && (
                      <div>
                        <ModalMessage>
                          {this.props.messages.prerequisites}
                        </ModalMessage>
                        {warningTokenMethods.map(one => (
                          <Method
                            key={`PrereqTokenMethod-${one.name}`}
                            method={one}
                            contract={'token'}
                            {...this.props}
                          />
                        ))}
                      </div>
                    )}

                    <Item gR={1}>
                      <Text>
                        {'Registry Address: ' + this.props.registry.address}
                      </Text>
                    </Item>
                    <Item gR={2}>
                      <Text>
                        {'Token Address: ' + this.props.token.address}
                      </Text>
                    </Item>
                    <Item gR={3}>
                      <Text>
                        {'Voting Address: ' + this.props.voting.address}
                      </Text>
                    </Item>

                    <FourItemGridContainer>
                      <Item gR={1} gC={1}>
                        <BoldInlineText>
                          {'Token Balance: '}
                          {tokenBalance &&
                            withCommas(trimDecimalsThree(tokenBalance))}
                        </BoldInlineText>
                      </Item>
                      <Item gR={2} gC={1}>
                        <BoldInlineText>
                          {`Registry Allowance: `}
                          {registryAllowance && withCommas(registryAllowance)}
                        </BoldInlineText>
                      </Item>
                      <Item gR={1} gC={2}>
                        <BoldInlineText>
                          {'Voting Allowance: '}
                          {votingAllowance && withCommas(votingAllowance)}
                        </BoldInlineText>
                      </Item>
                      <Item gR={2} gC={2}>
                        <BoldInlineText>
                          {'Voting Rights: '}
                          {votingRights && withCommas(votingRights)}
                        </BoldInlineText>
                      </Item>
                    </FourItemGridContainer>
                  </Container>

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
                </BigContainer>
                {/* <Item gR={5} gC={4}>
        <BoldInlineText>
          {'Voting Balance: '}
          {votingBalance && withCommas(votingBalance)}
        </BoldInlineText>
      </Item>
      <Item gR={6} gC={4}>
        <BoldInlineText>
          {'Locked Tokens: '}
          {lockedTokens && withCommas(lockedTokens)}
        </BoldInlineText>
      </Item> */}
              </div>
            </Methods>
          </ReactModal>

          <Button onClick={this.props.openModal}>{`${
            this.props.messages.heading
            }`}</Button>
        </Wrapper>
      </div>
    )
  }
}

export default UDappHOC(UDapp)
