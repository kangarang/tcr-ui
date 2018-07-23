import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import AppBar from '@material-ui/core/AppBar'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import ListingCard from './ListingCard'
import toJS from 'components/toJS'
import { colors } from '../../global-styles'

import {
  selectAllListings,
  selectFaceoffs,
  selectWhitelist,
  selectCandidates,
  onlyCandidateIDs,
  onlyFaceoffIDs,
  onlyWhitelistIDs,
} from 'modules/listings/selectors'
import {
  selectStats,
  selectVoting,
  selectAccount,
  selectRegistry,
  selectTCR,
  selectBalances,
} from 'modules/home/selectors'
import { selectSidePanelListing, selectSidePanelMethod } from 'modules/listings/selectors'
import * as actions from 'modules/listings/actions'

import Transactions from 'containers/Transactions/Loadable'
import TablePaginationActionsWrapped from './Pagination'

const ListingsWrapper = styled.div`
  width: 80vw;
  margin: 20px auto 0;
`
const FlexContainer = styled.div`
  display: flex;
  margin: 30px auto 0;
`

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    boxShadow: '0 0 0 0',
  },
  tableWrapper: {
    // overflowX: 'auto',
    padding: '0',
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

class SimpleTabs extends Component {
  state = {
    value: 0,
    page: 0,
    rowsPerPage: 5,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  // handleCheckReward = async id => {
  //   console.log('id:', id)
  //   if (id) {
  //     const tc = (await this.props.registry.tokenClaims(id, this.props.account))['0']
  //     const didReveal = (await this.props.voting.didReveal(this.props.account, id))['0']
  //     const numTokens = baseToConvertedUnit(
  //       (await this.props.voting.getNumTokens(this.props.account, id))['0'],
  //       this.props.tcr.get('tokenDecimals')
  //     )
  //     console.log('tokenClaim:', tc)
  //     console.log('didReveal:', didReveal)
  //     console.log('numTokens:', numTokens)
  //     if (didReveal && numTokens !== '0') {
  //       return true
  //     }
  //   }
  //   return false
  // }

  openSidePanel = (one, openThis) => {
    this.props.onOpenSidePanel(one, openThis)
  }
  render() {
    const {
      candidates,
      faceoffs,
      whitelist,
      stats,
      candidateIDs,
      faceoffIDs,
      whitelistIDs,
      chooseTCR,
      classes,
      voting,
      account,
      registry,
    } = this.props
    const { rowsPerPage, page, value } = this.state

    let data
    if (value === 0) {
      data = whitelistIDs
    } else if (value === 1) {
      data = candidateIDs
    } else if (value === 2) {
      data = faceoffIDs
    }
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <Transactions>
        <ListingsWrapper>
          <Paper className={classes.root}>
            <AppBar className={classes.appBar} position="static" color="inherit">
              <Tabs
                centered={false}
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
              >
                <Tab
                  className={classes.tab}
                  label={`registry (${stats.sizes.whitelist})`}
                />
                <Tab
                  className={classes.tab}
                  label={`applications (${stats.sizes.candidates})`}
                />
                <Tab className={classes.tab} label={`voting (${stats.sizes.faceoffs})`} />
              </Tabs>
            </AppBar>
            <div className={classes.tableWrapper}>
              <FlexContainer>
                {value === 0 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(id => {
                      return (
                        <ListingCard
                          key={id}
                          one={whitelist[id]}
                          listingType={'whitelist'}
                          openSidePanel={this.openSidePanel}
                          chooseTCR={chooseTCR}
                          listingData={whitelist[id].listingData}
                          voting={voting}
                          account={account}
                          registry={registry}
                          value={value}
                          claimRewardTrigger={false}
                        />
                      )
                    })}
                {value === 1 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(id => {
                      return (
                        <ListingCard
                          key={id}
                          one={candidates[id]}
                          listingType={'candidates'}
                          openSidePanel={this.openSidePanel}
                          updateTrigger={candidates[id].appExpiry.expired}
                          listingData={candidates[id].listingData}
                          value={value}
                          claimRewardTrigger={false}
                        />
                      )
                    })}
                {value === 2 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(id => {
                      return (
                        <ListingCard
                          key={id}
                          one={faceoffs[id]}
                          listingType={'faceoffs'}
                          openSidePanel={this.openSidePanel}
                          updateTrigger={faceoffs[id].revealExpiry.expired}
                          revealTrigger={faceoffs[id].commitExpiry.expired}
                          listingData={faceoffs[id].listingData}
                          voting={voting}
                          account={account}
                          registry={registry}
                          value={value}
                          // claimRewardTrigger={await this.handleCheckReward(candidates.getIn[id, 'challengeID'])}
                          claimRewardTrigger={false}
                        />
                      )
                    })}
              </FlexContainer>
              {emptyRows === 5 && (
                <TableRow component="div" style={{ height: 80 * emptyRows }}>
                  <div />
                </TableRow>
              )}

              <TablePagination
                component="span"
                colSpan={3}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                // ActionsComponent={TablePaginationActionsWrapped}
                classes={{
                  toolbar: classes.toolbar,
                  caption: classes.caption,
                }}
              />
            </div>
          </Paper>
        </ListingsWrapper>
      </Transactions>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onOpenSidePanel: (selectedOne, openThis) =>
      dispatch(actions.openSidePanel(selectedOne, openThis)),
  }
}

const mapStateToProps = createStructuredSelector({
  allListings: selectAllListings,
  candidates: selectCandidates,
  candidateIDs: onlyCandidateIDs,
  faceoffs: selectFaceoffs,
  faceoffIDs: onlyFaceoffIDs,
  whitelist: selectWhitelist,
  whitelistIDs: onlyWhitelistIDs,
  stats: selectStats,
  voting: selectVoting,
  account: selectAccount,
  registry: selectRegistry,
  tcr: selectTCR,
  balances: selectBalances,
  sidePanelListing: selectSidePanelListing,
  sidePanelMethod: selectSidePanelMethod,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withStyles(styles)(withConnect(toJS(SimpleTabs))))
