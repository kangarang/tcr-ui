import React from 'react'
import { Text, TextInput } from '@aragon/ui'
import translate from 'translations'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import { SideText } from './components'
import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import SidePanelSeparator from './components/SidePanelSeparator'
import TotalAmount from './components/TotalAmount'

// import { baseToConvertedUnit, BN } from 'utils/_units'
// import { withCommas } from 'utils/_values'

const styles = {
  textInput: {
    height: '50px',
  },
}

export default ({
  opened,
  closeSidePanel,
  token,
  contracts,
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

      <MarginDiv>
        <Text color="grey" smallcaps>
          {'listing'}
        </Text>
        <TextInput
          onChange={e => handleInputChange(e, 'listingName')}
          wide
          type="text"
          style={styles.textInput}
        />
      </MarginDiv>

      <MarginDiv>
        <Text color="grey" smallcaps>
          {'meta data'}
        </Text>
        <TextInput
          onChange={e => handleInputChange(e, 'data')}
          wide
          type="text"
          style={styles.textInput}
        />
      </MarginDiv>

      <SidePanelSeparator />

      <SideText
        small
        color="grey"
        text={translate('ins_apply')}
      />

      <TotalAmount
        copy={'Total Deposit'}
        minDeposit={parameters.get('minDeposit')}
        tokenSymbol={contracts.get('tokenSymbol')}
      />

      <SidePanelSeparator />

      <SideText color="grey" text={translate('mm_apply')} />

      <MarginDiv>
        <Button onClick={handleApply}>{'SUBMIT APPLICATION'}</Button>
        {miningStatus && (
          <div>
            <SideText color="grey" text={translate('txCost_')} />
            <TxnProgress />
          </div>
        )}
        {/* {latestTxn && (
          <a
            target="_blank"
            href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('tx')}`}
          >
            {latestTxn.get('tx')}
          </a>
        )} */}
      </MarginDiv>

      {/* if you wanna see approve, you'll see it */}
      {/* if not, and your current allowance is greater than the minimum deposit, you won't see it */}
      {/* <MarginDiv>
        {visibleApprove ? (
          <div>
            <Button onClick={e => handleApprove('registry')} mode="strong">
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
                <Button onClick={e => handleApprove('registry')} mode="strong">
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
      </MarginDiv> */}

      {/* <SideSplit
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
      /> */}
      {/* <MarginDiv>
        <Text color="grey" smallcaps>
          {'TOKEN AMOUNT'}
        </Text>
        <TextInput
          onChange={e => handleInputChange(e, 'numTokens')}
          wide
          type="number"
        />
      </MarginDiv> */}
    </SidePanel>
  </div>
)
