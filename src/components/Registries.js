import React, { Component } from 'react'
import styled from 'styled-components'

import Card from '@material-ui/core/Card'

import Button from 'components/Button'
import { registries } from 'config'

const CardName = styled.div`
  font-weight: 600;
  font-size: 1.4em;
  margin: 0 1.75em;
`
const RegistriesContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 1em 3.5em;
`
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

export default class Registries extends Component {
  render() {
    const { network, onSelectRegistry } = this.props

    return (
      <RegistriesContainer>
        {network &&
          registries[network].map(
            registry =>
              network !== 'unknown' && (
                <RegistryCard key={registry.registryAddress}>
                  <CardName>{registry.name}</CardName>
                  <SelectRegistryButton
                    id={registry.registryAddress}
                    onClick={() => onSelectRegistry(registry)}
                  >
                    View the List
                  </SelectRegistryButton>
                </RegistryCard>
              )
          )}
      </RegistriesContainer>
    )
  }
}
