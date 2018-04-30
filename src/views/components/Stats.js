import React from 'react'
import styled from 'styled-components'
import { colors } from 'views/global-styles'

import { trimDecimalsThree } from 'redux/libs/units'

import Identicon from './Identicon'

export default ({ account, balances, tcr, network, stats, error }) => (
  <GridContainer>
    <GridItem>
      <CapsDiv>{'total applications'}</CapsDiv>
      <BoldDiv>{stats.sizes.candidates}</BoldDiv>
    </GridItem>

    <GridItem>
      <CapsDiv>
        {'total '}
        <TokenSpan>{tcr.get('tokenSymbol')}</TokenSpan>
        {' at stake'}
      </CapsDiv>
      <BoldDiv>{balances.get('totalRegistryStake')}</BoldDiv>
    </GridItem>

    <GridItem>
      <CapsDiv>{'listings in registry'}</CapsDiv>
      <BoldDiv>{stats.sizes.whitelist}</BoldDiv>
    </GridItem>

    {error ? (
      <UserInfoGridItem>
        <UserItem>
          <Error>{'Enable MetaMask to send transactions'}</Error>
        </UserItem>
      </UserInfoGridItem>
    ) : (
      <UserInfoGridItem>
        <UserItem>
          <BoldDivColored network={network}>{network}</BoldDivColored>
        </UserItem>
        <UserItem>
          <BoldDiv>
            {trimDecimalsThree(balances.get('ETH'))}
            <BoldDivGrey>{'ΞTH'}</BoldDivGrey>
          </BoldDiv>
        </UserItem>
        <UserItem>
          <BoldDiv>
            {trimDecimalsThree(balances.get('token'))}
            <BoldDivGrey>{tcr.get('tokenSymbol')}</BoldDivGrey>
          </BoldDiv>
        </UserItem>
        <UserItem>
          <a
            target="_blank"
            href={`https://${
              network !== 'mainnet' ? network + '.' : ''
            }etherscan.io/address/${account}`}
          >
            <Identicon address={account} diameter={30} />
          </a>
        </UserItem>
      </UserInfoGridItem>
    )}
  </GridContainer>
)

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 9fr 6fr 6fr 11fr;
  grid-column-gap: 2px;
  align-items: center;
  height: 5.5em;
  color: ${colors.offBlack};
  background-color: lightgrey; // grid-line color
  border: 1px solid black;
  box-sizing: border-box;
`
const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  padding: 0 2em;
  background-color: white;
`
const CapsDiv = styled.div`
  font-size: 0.9em;
  text-transform: uppercase;
`
const TokenSpan = styled.span`
  color: black;
  font-weight: bold;
  font-size: 1.2em;
`
const Error = styled.div`
  color: orange;
  font-weight: bold;
  font-size: 1.2em;
`
const BoldDiv = styled(CapsDiv)`
  color: black;
  font-weight: bold;
  font-size: 1em;
`
const BoldDivGrey = styled(BoldDiv)`
  display: inline;
  color: grey;
  margin-left: 0.5em;
  font-size: 0.8em;
`
const BoldDivColored = styled(BoldDiv)`
  color: ${props =>
    props.network === 'rinkeby'
      ? 'orange'
      : props.network === 'mainnet' ? '#2eab6f' : 'purple'};
`
const UserInfoGridItem = styled(GridItem)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const UserItem = styled.div`
  margin: 0 0.3em;
`
