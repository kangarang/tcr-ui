import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import { withStyles } from '@material-ui/core/styles'

import { colors } from 'global-styles'
import { selectTxPanelListing, selectTxPanelMethod } from 'modules/transactions/selectors'
import * as actions from 'modules/transactions/actions'

import toJS from 'components/toJS'
import ListingCard from './components/ListingCard'

const ListingsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 90vw;
  margin: 20px auto 0;
`

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    boxShadow: '0 0 0 0',
  },
  tableWrapper: {
    // overflowX: 'auto',
    // padding: '0',
  },
  appBar: {
    boxShadow: '0 0 0 0',
    borderBottom: `.5px solid ${colors.paleGrey}`,
  },
  tab: {
    '& > span': {
      '& > span': {
        paddingLeft: '5px',
      },
    },
    fontWeight: 'bold',
  },
  caption: {
    display: 'none',
  },
})

class Listings extends Component {
  render() {
    const { listingType, visibleListings, onOpenTxPanel } = this.props

    return (
      <ListingsContainer>
        {Object.keys(visibleListings).map(li => (
          <div key={li}>
            <ListingCard
              one={visibleListings[li]}
              listingType={listingType}
              openTxPanel={onOpenTxPanel}
              updateTrigger={
                listingType === 'faceoffs'
                  ? visibleListings[li].revealExpiry.expired
                  : listingType === 'applications'
                    ? visibleListings[li].appExpiry.expired
                    : false
              }
              revealTrigger={
                listingType === 'faceoffs'
                  ? visibleListings[li].commitExpiry.expired
                  : false
              }
              claimRewardTrigger={false}
            />
          </div>
        ))}
      </ListingsContainer>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  txPanelListing: selectTxPanelListing,
  txPanelMethod: selectTxPanelMethod,
})

const withConnect = connect(
  mapStateToProps,
  {
    onOpenTxPanel: actions.openTxPanel,
  }
)

export default compose(withStyles(styles)(withConnect(toJS(Listings))))
