import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Welcome } from '@storybook/react/demo'

import Card from '@material-ui/core/Card'
import Button from '../components/Button'

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
))

const ListingCard = styled(Card)`
  display: flex;
  width: 220px;
  height: 400px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-family: Helvetica;
  overflow: 'hidden';
`
const ListingName = styled.div`
  font-weight: bold;
  font-size: 1.3em;
  margin: 0 1.3em;
`
storiesOf('Listing Card', module).add('In Registry', () => (
  <ListingCard>
    <ListingName>{'NAME'}</ListingName>
    <Button mode="strong" wide methodName="challenge" onClick={action('CHALLENGE')}>
      {'CHALLENGE'}
    </Button>
  </ListingCard>
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
const RegistryName = styled.div`
  font-weight: bold;
  font-size: 1.3em;
  margin: 0 1.3em;
`
const LButton = styled(Button)`
  border: 1.5px solid black;
  border-radius: 0;
  font-size: 1.1em;
  padding: 0.6em 1em;
  margin: 1.2em;
`
storiesOf('Registry Overview', module).add('Registry Card', () => (
  <RegistryCard>
    <RegistryName>{'REGISTRY ONE'}</RegistryName>
    <LButton onClick={action('selectRegistry')}>View the List</LButton>
  </RegistryCard>
))
