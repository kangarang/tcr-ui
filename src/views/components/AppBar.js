import React from 'react'
import styled from 'styled-components'

import Text from 'views/components/Text'
import Button from 'views/components/Button'

const Wrapper = styled.div`
  flex-shrink: 0;
`
const GridContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4em;
  background-color: white;
  padding: 1em;
`

const GridItem = styled.div`
  font-weight: bold;
`

export default ({ error, openSidePanel, tcr }) => (
  <Wrapper>
    <GridContainer>
      {error ? (
        <GridItem gc={1}>
          <div>{''}</div>
        </GridItem>
      ) : (
        <GridItem gc={1}>
          <Button onClick={openSidePanel}>{'Start an application'}</Button>
        </GridItem>
      )}

      <GridItem gc={2}>
        <Text size="xxlarge" weight="bold">
          {tcr.get('registryName')}
        </Text>
      </GridItem>

      <GridItem gc={3}>{'Challenge Vote Activities About TCR'}</GridItem>
    </GridContainer>
  </Wrapper>
)
