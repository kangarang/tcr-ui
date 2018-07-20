import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Card from '@material-ui/core/Card'
import Button from '../components/Button'
import Registries from 'components/Registries'

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
  font-weight: 600;
  font-size: 1.4em;
  margin: 0 1.75em;
`
storiesOf('Cards', module).add('Challenge Listing', () => (
  <TallListingCard>
    <CardName>{'NAME'}</CardName>
    <Button mode="strong" wide methodName="challenge" onClick={action('CHALLENGE')}>
      {'CHALLENGE'}
    </Button>
  </TallListingCard>
))

const RegistryCard = styled(Card)`
  display: flex;
  width: 320px;
  height: 240px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  overflow: 'hidden';
  font-family: 'Avenir Next';
  margin: 0.5em;
`
const SelectRegistryButton = styled(Button)`
  border: 1.5px solid #333;
  border-radius: 0;
  font-size: 0.9em;
  font-weight: 500;
  padding: 0.75em 1.25em;
  margin: 1.5em 2.75em 2.75em;
`
storiesOf('Cards', module).add('Select Registry', () => (
  <RegistryCard>
    <CardName>{'REGISTRY ONE'}</CardName>
    <SelectRegistryButton onClick={action('selectRegistry')}>
      View the List
    </SelectRegistryButton>
  </RegistryCard>
))

storiesOf('Cards', module).add('Select Many Registries', () => <Registries />)
