import React from 'react'
import styled from 'styled-components'
import { Button, Text } from '@aragon/ui'

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
`

export default ({ error, openSidePanel, contracts }) => (
  <Wrapper>
    {error ? (
      <GridContainer>
        <div>{error.message}</div>
      </GridContainer>
    ) : (
      <GridContainer>
        <GridItem gc={1}>
          <Button mode="strong" onClick={openSidePanel}>
            {'Start an application'}
          </Button>
        </GridItem>

        <GridItem gc={2}>
          <Text size="xlarge" weight="bold">
            {contracts.get('registryName')}
          </Text>
        </GridItem>

        <GridItem gc={3}>
          <Text>{'LINKS'}</Text>
        </GridItem>
      </GridContainer>
    )}
  </Wrapper>
)
