import React from 'react'
import styled from 'styled-components'

import Identicon from 'components/Identicon'

const FlexDiv = styled.div`
  display: flex;
  padding: 0.4em;
`

export function getEtherscanLink(network, txHash) {
  if (network === 'mainnet') {
    return (
      <FlexDiv>
        <Identicon address={txHash} diameter={14} />
        <a target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
          {'Etherscan'}
        </a>
      </FlexDiv>
    )
  }
  return (
    <FlexDiv>
      <Identicon address={txHash} diameter={14} />
      <a target="_blank" href={`https://${network}.etherscan.io/tx/${txHash}`}>
        {'Etherscan'}
      </a>
    </FlexDiv>
  )
}
