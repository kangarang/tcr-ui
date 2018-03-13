import React from 'react'
import { Button, Section } from '@aragon/ui'

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
        <Section>{contracts.get('registryName')}</Section>
        <Section>{'LINKS'}</Section>
      </AppBar>
    )}
  </AppBarWrapper>
)
