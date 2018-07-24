import React from 'react'
import styled from 'styled-components'

const StatsWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 4.5em;
  background-color: white;
  font-family: 'Avenir Next';
  padding: 1em 4em;
`
const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2em;
`
const Stat = styled.div`
  font-size: 1.1em;
  font-weight: 600;
`
const StatLabel = styled.div`
  font-size: 0.75em;
  font-weight: 500;
`

export default ({ stats, account, balances, network, tcr }) => (
  <StatsWrapper>
    <StatContainer>
      <Stat>{stats.sizes.candidates}</Stat>
      <StatLabel>TOTAL APPLICATIONS</StatLabel>
    </StatContainer>
    <StatContainer>
      <Stat>{balances.totalStake}</Stat>
      <StatLabel>{`TOTAL ${tcr.tokenSymbol} STAKED`}</StatLabel>
    </StatContainer>
    <StatContainer>
      <Stat>{stats.sizes.whitelist}</Stat>
      <StatLabel>LISTINGS IN REGISTRY</StatLabel>
    </StatContainer>
  </StatsWrapper>
)

//   {error ? (
//     <UserInfoGridItem>
//       <UserItem>
//         <Error>{'Enable MetaMask to send transactions'}</Error>
//       </UserItem>
//     </UserInfoGridItem>
//   ) : (
//     <UserInfoGridItem>
//       <UserItem>
//         <BoldDivColored network={network}>{network}</BoldDivColored>
//       </UserItem>
//       <UserItem>
//         <BoldDiv>
//           {balances.token}
//           <BoldDivGrey onClick={openSidePanel}>{tcr.tokenSymbol}</BoldDivGrey>
//         </BoldDiv>
//       </UserItem>
//       <UserItem>
//         <a
//           target="_blank"
//           href={`https://${
//             network !== 'mainnet' ? network + '.' : ''
//           }etherscan.io/address/${account}`}
//         >
//           <Identicon address={account} diameter={30} />
//         </a>
//       </UserItem>
//     </UserInfoGridItem>
//   )}
