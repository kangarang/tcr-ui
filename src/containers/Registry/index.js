import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'

import { colors, theme, muiTheme } from 'global-styles'
import { makeSelectVisibleListings } from 'modules/listings/selectors'
import { selectStats, selectTCR } from 'modules/home/selectors'

import toJS from 'components/toJS'
import Wrapper from '../Wrapper'
import Listings from '../Listings/Loadable'

const Table = styled.div`
  flex-grow: 1;
  background-color: ${theme.contentBackground};
  box-shadow: 0 0 0 0;
  box-sizing: border-box;
`
const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 90vw;
  margin: 20px auto 0;
`

const styles = theme => ({
  tabsRoot: {
    width: '100%',
    boxSizing: 'border-box',
    borderBottom: `2px solid ${colors.paleGrey}`,
    fontWeight: 'bold',
  },
  tabsIndicator: {
    backgroundColor: '#74FAB0',
    height: 4,
  },
  tabRoot: {
    textTransform: 'initial',
    fontWeight: muiTheme.typography.fontWeightRegular,
    padding: '0 1em',
    fontFamily: theme.fontFamily,
    '&:hover': {
      color: '#1890ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: 'black',
      fontWeight: muiTheme.typography.fontWeightBold,
    },
    '&:focus': {
      color: 'black',
      fontWeight: muiTheme.typography.fontWeightBold,
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
})

class Registry extends Component {
  state = {
    value: 'whitelist',
  }
  handleChange = (event, value) => {
    this.setState({ value })
    this.props.history.push(`/${this.props.tcr.registryAddress.slice(0, 8)}/${value}`)
  }
  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  render() {
    const { value } = this.state
    const { classes, stats, visibleListings } = this.props

    return (
      <Wrapper>
        <Table>
          <TabsContainer>
            <Tabs
              centered={false}
              value={value}
              onChange={this.handleChange}
              classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
            >
              {/* router navlinks change the value of props.filter
                what matters in practice is that there is only 1 single source of truth for any independent piece of data
                redux: listings, react-router: anything that can be computed by the URL (visibility filter) */}
              <Tab
                disableRipple
                value="whitelist"
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                label={`IN REGISTRY (${stats.sizes.whitelist})`}
              />
              <Tab
                disableRipple
                value="applications"
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                label={`NEW APPLICATIONS (${stats.sizes.applications})`}
              />
              <Tab
                disableRipple
                value="faceoffs"
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                label={`VOTE (${stats.sizes.faceoffs})`}
              />
            </Tabs>
          </TabsContainer>

          <Listings listingType={value} visibleListings={visibleListings} />
        </Table>
      </Wrapper>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  stats: selectStats,
  tcr: selectTCR,
  // send route-based props to selector
  visibleListings: makeSelectVisibleListings(),
})

const withConnect = connect(mapStateToProps)

export default compose(withStyles(styles)(withConnect(toJS(Registry))))
