import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import AppBar from 'material-ui/AppBar'
import { withStyles } from 'material-ui/styles'
import Tabs, { Tab } from 'material-ui/Tabs'
import { TablePagination, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

import ListingCard from './ListingCard'
import { colors } from '../../global-styles'

import {
  selectAllListings,
  selectFaceoffs,
  selectWhitelist,
  selectCandidates,
  onlyCandidateIDs,
  onlyFaceoffIDs,
  onlyWhitelistIDs,
} from 'redux/modules/listings/selectors'
import * as actions from 'redux/modules/listings/actions'

import Transactions from 'views/containers/Transactions/Loadable'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.textSecondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
})

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  }

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    )
  }
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
)
const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    boxShadow: '0 0 0 0',
  },
  tableWrapper: {
    overflowX: 'auto',
    padding: '0',
  },
  appBar: {
    boxShadow: '0 0 0 0',
    borderBottom: `.5px solid ${colors.paleGrey}`,
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

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  openSidePanel = (one, openThis) => {
    this.props.onOpenSidePanel(one, openThis)
  }
  render() {
    const {
      registry,
      candidates,
      faceoffs,
      whitelist,

      candidateIDs,
      faceoffIDs,
      whitelistIDs,
      chooseTCR,
      classes,
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
                <Tab label="registry" />
                <Tab label="applications" />
                <Tab label="voting" />
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
                          one={whitelist.get(id)}
                          listingType={'whitelist'}
                          openSidePanel={this.openSidePanel}
                          chooseTCR={chooseTCR}
                          registry={registry}
                          tokenData={whitelist.getIn([id, 'tokenData'])}
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
                          one={candidates.get(id)}
                          listingType={'candidates'}
                          openSidePanel={this.openSidePanel}
                          updateTrigger={candidates.getIn([id, 'appExpiry', 'expired'])}
                          tokenData={candidates.getIn([id, 'tokenData'])}
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
                          one={faceoffs.get(id)}
                          listingType={'faceoffs'}
                          openSidePanel={this.openSidePanel}
                          updateTrigger={faceoffs.getIn([id, 'revealExpiry', 'expired'])}
                          revealTrigger={faceoffs.getIn([id, 'commitExpiry', 'expired'])}
                          tokenData={faceoffs.getIn([id, 'tokenData'])}
                        />
                      )
                    })}
              </FlexContainer>
              {emptyRows === 5 && (
                <TableRow component="div" style={{ height: 60 * emptyRows }}>
                  <div />
                </TableRow>
              )}

              <TablePagination
                component="div"
                colSpan={3}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                Actions={TablePaginationActionsWrapped}
              />
            </div>
          </Paper>
        </ListingsWrapper>
      </Transactions>
    )
  }
}

const ListingsWrapper = styled.div`
  width: 84vw;
  margin: 10px auto 0;
`
const FlexContainer = styled.div`
  display: flex;
  margin: 10px auto 0;
`
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
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withStyles(styles)(withConnect(SimpleTabs)))
