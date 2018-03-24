import React from 'react'
import {
  SidePanelSeparator,
  Text,
  TextInput,
} from '@aragon/ui'
import translate from 'translations'

import SidePanel from 'containers/Transaction/SidePanel'
import { SideSplit, SideText } from 'components/SidePanelOverlay'
import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import { baseToConvertedUnit, BN } from 'utils/_units'
import { withCommas } from 'utils/_values'
import TxnProgress from '../Transaction/TxnProgress'

export default ({
  opened,
  closeSidePanel,
  token,
  contracts,
  parameters,
  balances,
  handleInputChange,
  handleSendTransaction,
  openApprove,
  visibleApprove,
  miningStatus,
  latestTxn,
}) => (
  <div>
    <SidePanel
      title="Apply a Listing into the Registry"
      opened={opened}
      onClose={closeSidePanel}
    >
      <SideSplit
        leftTitle={'Application Period'}
        leftItem={<div>{`${parameters.get('applyStageLen')} seconds`}</div>}
        rightTitle={'Minimum Deposit'}
        rightItem={
          <div>{`${parameters.get('minDeposit')} ${contracts.get(
            'tokenSymbol'
          )}`}</div>
        }
      />

      <SideSplit
        leftTitle={'Token Balance'}
        leftItem={balances.get('token')}
        rightTitle={'Registry Allowance'}
        rightItem={withCommas(balances.get('registryAllowance'))}
      />

      <SideSplit
        leftTitle={'Voting Rights'}
        leftItem={balances.get('votingRights')}
        rightTitle={'Voting Allowance'}
        rightItem={withCommas(balances.get('votingAllowance'))}
      />

      <SideText
        small
        title={'QUESTION'}
        text={translate('sidebar_apply_question')}
      />
      <SideText
        small
        title={'INSTRUCTIONS'}
        text={translate('sidebar_apply_instructions')}
      />

      <MarginDiv>
        <Text color="grey" smallcaps>
          {'LISTING NAME'}
        </Text>
        <TextInput
          onChange={e => handleInputChange(e, 'listingName')}
          wide
          type="text"
        />
      </MarginDiv>

      <MarginDiv>
        <Text color="grey" smallcaps>
          {'TOKEN AMOUNT'}
        </Text>
        <TextInput
          onChange={e => handleInputChange(e, 'numTokens')}
          wide
          type="number"
        />
      </MarginDiv>

      <MarginDiv>
        <Text color="grey" smallcaps>
          {'IPFS DATA'}
        </Text>
        <TextInput
          onChange={e => handleInputChange(e, 'data')}
          wide
          type="text"
        />
      </MarginDiv>

      <MarginDiv>
        <Button onClick={e => handleSendTransaction('apply')} mode="strong">
          {'Apply Listing'}
        </Button>
        {miningStatus && <TxnProgress />}
        {latestTxn && (
          <a
            target="_blank"
            href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('tx')}`}
          >
            {latestTxn.get('tx')}
          </a>
        )}
      </MarginDiv>

      <SidePanelSeparator />

      {/* if you wanna see approve, you'll see it */}
      {/* if not, and your current allowance is greater than the minimum deposit, you won't see it */}
      <MarginDiv>
        {visibleApprove ? (
          <div>
            <Button
              onClick={e => handleSendTransaction('approve', null, 'registry')}
              mode="strong"
            >
              {'Approve tokens for Registry'}
            </Button>
            {miningStatus && <TxnProgress />}
          </div>
        ) : (
          <div>
            {BN(balances.get('registryAllowance')).lt(
              BN(baseToConvertedUnit(parameters.get('minDeposit'), 18))
            ) ? (
              <div>
                <Text color="red">{'YOU NEED TO APPROVE'}</Text>
                <Button
                  onClick={e =>
                    handleSendTransaction('approve', null, 'registry')
                  }
                  mode="strong"
                >
                  {'Approve tokens for Registry'}
                </Button>
                {miningStatus && <TxnProgress />}
              </div>
            ) : (
              <Button onClick={openApprove} mode="">
                {'Show approve'}
              </Button>
            )}
          </div>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
