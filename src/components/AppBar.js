import React from 'react'
import styled from 'styled-components'
import { Text } from '@aragon/ui'
import Button from 'components/Button'
import { colors } from '../global-styles'

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

const GridItem = styled.div``

const BoldDiv = styled.div`
  color: ${colors.offBlack};
  font-weight: bold;
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
          <Button onClick={openSidePanel}>
            <BoldDiv>{'Start an application'}</BoldDiv>
          </Button>
        </GridItem>

        <GridItem gc={2}>
          <Text size="xlarge" weight="bold">
            <BoldDiv>{contracts.get('registryName')}</BoldDiv>
          </Text>
        </GridItem>

        <GridItem gc={3}>
          <BoldDiv>{'Challenge Vote Activities About TCR'}</BoldDiv>
        </GridItem>
      </GridContainer>
    )}
  </Wrapper>
)
