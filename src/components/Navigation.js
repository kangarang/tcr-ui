import React from 'react'

import { AppBar, AppBarWrapper } from './StyledHome'

import { Button, Text, Section } from '@aragon/ui'

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
