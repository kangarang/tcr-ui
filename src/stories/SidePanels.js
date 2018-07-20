import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Card from '@material-ui/core/Card'
import Button from '../components/Button'

const TallListingCard = styled(Card)`
  display: flex;
  width: 220px;
  height: 400px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-family: Helvetica;
  overflow: 'hidden';
`
const CardName = styled.div`
  font-weight: bold;
  font-size: 1.3em;
  margin: 0 1.3em;
`
storiesOf('SidePanels', module).add('Commit Vote', () => (
  <TallListingCard>
    <CardName>{'NAME'}</CardName>
    <Button mode="strong" wide methodName="challenge" onClick={action('CHALLENGE')}>
      {'CHALLENGE'}
    </Button>
  </TallListingCard>
))

const RegistryCard = styled(Card)`
  display: flex;
  width: 360px;
  height: 240px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-family: Helvetica;
  overflow: 'hidden';
`
const SelectRegistryButton = styled(Button)`
  border: 1.5px solid black;
  border-radius: 0;
  font-size: 1.1em;
  padding: 0.6em 1em;
  margin: 1.2em;
`
storiesOf('Cards', module).add('Select Registry', () => (
  <RegistryCard>
    <CardName>{'REGISTRY ONE'}</CardName>
    <SelectRegistryButton onClick={action('selectRegistry')}>
      View the List
    </SelectRegistryButton>
  </RegistryCard>
))
