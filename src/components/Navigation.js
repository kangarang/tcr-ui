import React from 'react'
import { Button, Text } from '@aragon/ui'

import { AppBar, AppBarWrapper } from './StyledHome'

export default ({ error, openSidePanel, contracts }) => (
  <AppBarWrapper>
    {error ? (
      <AppBar>
        <div>{error.message}</div>
      </AppBar>
    ) : (
      <AppBar>
        <Button mode="strong" onClick={openSidePanel}>
          {'Start an application'}
        </Button>
        <Text size="xlarge" weight="bold">
          {contracts.get('registryName')}
        </Text>
        <Text>{'LINKS'}</Text>
      </AppBar>
    )}
  </AppBarWrapper>
)
