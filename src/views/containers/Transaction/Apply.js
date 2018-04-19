import React from 'react'

import { BN, baseToConvertedUnit } from 'state/libs/units'

import translate from 'views/translations'
import { colors } from 'views/global-styles'

import Text from 'views/components/Text'
import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import TotalAmount from './components/TotalAmount'

import SidePanel from './components/SidePanel'
import TxnProgress from './TxnProgress'

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
  showApprove,
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
        minDeposit={parameters.get('minDeposit')}
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
            {BN(balances.get('registryAllowance')).lt(
              BN(baseToConvertedUnit(parameters.get('minDeposit'), 18))
            ) ? (
              <div>
                <Text color="red">{'YOU NEED TO APPROVE'}</Text>
                <Button onClick={e => handleApprove('registry')} mode="strong">
                  {'Approve tokens for Registry'}
                </Button>
              </div>
            ) : (
              <Button onClick={showApprove} mode="">
                {'Show approve'}
              </Button>
            )}
          </div>
        )}
        {miningStatus && (
          <div>
            <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('transactionHash')}`}>
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
