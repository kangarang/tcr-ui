import React from 'react'
import styled from 'styled-components'

import Text from 'views/components/Text'
import Button from 'views/components/Button'
import NavBar from 'views/components/NavBar'
import Identicon from './Identicon'

const Wrapper = styled.div`
  flex-shrink: 0;
`
const GridContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0.2em 1em;
`

const GridItem = styled.div`
  font-weight: bold;
`
const GridItemF = styled(GridItem)`
  display: flex;
`

export default ({ error, openSidePanel, network, tcr }) => (
  <Wrapper>
    <GridContainer>
      {error ? (
        <GridItem gc={1}>
          <div>{''}</div>
        </GridItem>
      ) : (
        <GridItem gc={1}>
          <Button methodName="apply" onClick={openSidePanel}>
            {'Start an application'}
          </Button>
        </GridItem>
      )}

      <GridItemF gc={2}>
        <a
          target="_blank"
          href={`https://${
            network !== 'mainnet' ? network + '.' : ''
          }etherscan.io/address/${tcr.get('registryAddress')}`}
        >
          <Identicon address={tcr.get('registryAddress')} diameter={20} />
        </a>
        <Text size="xxlarge" weight="bold">
          {tcr.get('registryName')}
        </Text>
      </GridItemF>

      <GridItem gc={3}>
        <NavBar />
      </GridItem>
    </GridContainer>
  </Wrapper>
)
