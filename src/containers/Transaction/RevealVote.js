import React from 'react'
import translate from 'translations'
import { withCommas } from 'utils/_values'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import Button from 'components/Button'
import { SideSplit, SideText } from 'containers/Transaction/components'
import { MarginDiv, FileInput } from 'components/StyledHome'

import SidePanelSeparator from './components/SidePanelSeparator'

export default ({
  opened,
  closeSidePanel,
  parameters,
  balances,
  handleFileInput,
  handleRevealVote,
  selectedOne,
  miningStatus,
  latestTxn,
}) => (
  <SidePanel title="Reveal Vote" opened={opened} onClose={closeSidePanel}>
    <SideSplit
      leftTitle={'Reveal Period'}
      leftItem={`Reveal: ${parameters.get('revealStageLen')} seconds`}
      rightTitle={'POLL ID'}
      rightItem={selectedOne && selectedOne.getIn(['latest', 'pollID'])}
    />
    <SideSplit
      leftTitle={'Token Balance'}
      leftItem={withCommas(balances.get('token'))}
      rightTitle={'Voting Allowance'}
      rightItem={withCommas(balances.get('votingAllowance'))}
    />

    <SideText small text={'REVEAL VOTE'} />
    <SideText small text={selectedOne && selectedOne.get('listingID')} />

    <SidePanelSeparator />

    <SideText text={'INSTRUCTIONS'} />

    <SideText text={translate('ins_revealVote')} />

    <MarginDiv>
      <FileInput type="file" name="file" onChange={handleFileInput} />
    </MarginDiv>
    <MarginDiv>
      <Button onClick={handleRevealVote} mode="strong" wide>
        {'Reveal Vote'}
      </Button>
    </MarginDiv>
    {miningStatus && (
      <div>
        <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('hash')}`}>
          {'etherscan'}
        </Button>
        <TxnProgress />
      </div>
    )}
  </SidePanel>
)
