import React from 'react'
import styled from 'styled-components'

import {
  SidePanel,
  SidePanelSeparator,
  Button,
  Text,
  TextInput,
} from '@aragon/ui'

import { Icon } from 'semantic-ui-react'
import translate from '../../../translations'

const MarginDiv = styled.div`
  margin: 1em 0;
`
export default ({
  contract,
  methods,
  openCallPanel,
  closeSidePanel,
  handleCallInputChange,
  handleCall,
}) => (
  <SidePanel
    title="U D A P P"
    opened={openCallPanel === contract}
    onClose={closeSidePanel}
  >
    <MarginDiv>
      <Icon name="check circle" size="small" />
      <Text color="grey" smallcaps>
        {'INSTRUCTIONS'}
      </Text>
    </MarginDiv>
    <MarginDiv>
      <Text>{translate('sidebar_udapp_instructions')}</Text>
    </MarginDiv>

    <SidePanelSeparator />

    {methods.map(method => (
      <div key={method.name}>
        <MarginDiv>
          {method.inputs.map(inp => (
            <TextInput
              key={inp.name}
              placeholder={inp.name}
              onChange={e => handleCallInputChange(e, method.name, inp.name)}
              wide
              type="text"
            />
          ))}
          <MarginDiv>
            <Button
              onClick={e => handleCall(contract, method)}
              mode="strong"
              wide
            >
              <Text color="white" smallcaps>
                {method.name}
              </Text>
            </Button>
          </MarginDiv>
        </MarginDiv>
      </div>
    ))}
  </SidePanel>
)
