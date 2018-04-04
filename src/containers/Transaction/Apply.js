import React from 'react'
import translate from 'translations'
import { Text } from '@aragon/ui'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import TotalAmount from './components/TotalAmount'

import { BN, baseToConvertedUnit } from 'libs/units'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import { colors } from '../../global-styles'

export default ({
  opened,
  closeSidePanel,
  token,
  tcr,
  parameters,
  balances,
  handleInputChange,
  handleApprove,
  handleApply,
  visibleApprove,
  openApprove,
  miningStatus,
  latestTxn,
}) => (
  <div>
    <SidePanel title="Start an Application" opened={opened} onClose={closeSidePanel}>
      <SidePanelSeparator />

      <SideTextInput
        title="listing id"
        type="text"
        handleInputChange={e => handleInputChange(e, 'listingID')}
      />

      {/* <SideTextInput
        title="data"
        type="text"
        handleInputChange={e => handleInputChange(e, 'data')}
      /> */}

      <SidePanelSeparator />

      <SideText small color="grey" text={translate('ins_apply')} />

      <TotalAmount
        copy={'Minimum Deposit'}
        minDeposit={parameters.minDeposit}
        tokenSymbol={tcr.tokenSymbol}
      />

      {/* TODO: hide this unless user wants to deposit more than the minDeposit */}
      <SideTextInput
        title="tokens"
        type="number"
        handleInputChange={e => handleInputChange(e, 'numTokens')}
      />

      <SidePanelSeparator />

      <SideText color="grey" text={translate('mm_apply')} />

      <MarginDiv>
        <Button bgColor={colors.brightBlue} wide fgColor={'white'} onClick={handleApply}>
          {'SUBMIT APPLICATION'}
        </Button>
      </MarginDiv>

      {/* if you wanna see approve, you'll see it */}
      {/* if not, and your current allowance is greater than the minimum deposit, you won't see it */}
      <MarginDiv>
        {visibleApprove ? (
          <div>
            <Button onClick={e => handleApprove('registry')} mode="strong">
              {'Approve tokens for Registry'}
            </Button>
          </div>
        ) : (
          <div>
            {BN(balances.registryAllowance).lt(
              BN(baseToConvertedUnit(parameters.minDeposit, 18))
            ) ? (
              <div>
                <Text color="red">{'YOU NEED TO APPROVE'}</Text>
                <Button onClick={e => handleApprove('registry')} mode="strong">
                  {'Approve tokens for Registry'}
                </Button>
              </div>
            ) : (
              <Button onClick={openApprove} mode="">
                {'Show approve'}
              </Button>
            )}
          </div>
        )}
        {miningStatus && (
          <div>
            <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.hash}`}>
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
        {latestTxn && (
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${latestTxn.hash}`}>
            {latestTxn.hash}
          </a>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
