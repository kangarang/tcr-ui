import React, { Component } from 'react'
import styled from 'styled-components'
import AppBar from 'material-ui/AppBar'
import { withStyles } from 'material-ui/styles'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'

import imgSrc from 'assets/icons/adtoken.svg'

import ListingMediaCard from './ListingMediaCard'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
})

class SimpleTabs extends Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const {
      classes,
      registry,
      candidates,
      faceoffs,
      whitelist,
      openSidePanel,
      chooseTCR,
      handleUpdateStatus,
    } = this.props
    const { value } = this.state

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Tabs value={value} onChange={this.handleChange} indicatorColor="primary">
            <Tab label="registry" />
            <Tab label="applications" />
            <Tab label="voting" />
          </Tabs>
        </AppBar>

        {value === 0 && (
          <TabContainer>
            <FlexContainer>
              {Object.keys(whitelist).map(k => (
                <ListingMediaCard
                  key={k}
                  one={whitelist[k]}
                  imgSrc={imgSrc}
                  listingType={'whitelist'}
                  openSidePanel={openSidePanel}
                  chooseTCR={chooseTCR}
                  registry={registry}
                  tokenData={whitelist[k].tokenData}
                />
              ))}
            </FlexContainer>
          </TabContainer>
        )}

        {value === 1 && (
          <TabContainer>
            <FlexContainer>
              {Object.keys(candidates).map(k => (
                <ListingMediaCard
                  key={k}
                  one={candidates[k]}
                  imgSrc={imgSrc}
                  listingType={'candidates'}
                  openSidePanel={openSidePanel}
                  handleUpdateStatus={handleUpdateStatus}
                  updateTrigger={candidates[k].appExpiry.expired}
                  tokenData={candidates[k].tokenData}
                />
              ))}
            </FlexContainer>
          </TabContainer>
        )}

        {value === 2 && (
          <TabContainer>
            <FlexContainer>
              {Object.keys(faceoffs).map(k => (
                <ListingMediaCard
                  key={k}
                  one={faceoffs[k]}
                  imgSrc={imgSrc}
                  listingType={'faceoffs'}
                  openSidePanel={openSidePanel}
                  handleUpdateStatus={handleUpdateStatus}
                  updateTrigger={faceoffs[k].revealExpiry.expired}
                  revealTrigger={faceoffs[k].commitExpiry.expired}
                  tokenData={faceoffs[k].tokenData}
                />
              ))}
            </FlexContainer>
          </TabContainer>
        )}
      </div>
    )
  }
}

const FlexContainer = styled.div`
  display: flex;
`

export default withStyles(styles)(SimpleTabs)
