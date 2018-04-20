import React, { Component } from 'react'
import styled from 'styled-components'
import AppBar from 'material-ui/AppBar'
import { withStyles } from 'material-ui/styles'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'

import ListingCard from './ListingCard'

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

      candidateIDs,
      faceoffIDs,
      whitelistIDs,
      openSidePanel,
      chooseTCR,
      handleUpdateStatus,
      allListings,
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
              {whitelistIDs.map(id => (
                <ListingCard
                  key={id}
                  one={whitelist.get(id)}
                  listingType={'whitelist'}
                  openSidePanel={openSidePanel}
                  chooseTCR={chooseTCR}
                  registry={registry}
                  tokenData={whitelist.getIn([id, 'tokenData'])}
                />
              ))}
            </FlexContainer>
          </TabContainer>
        )}

        {value === 1 && (
          <TabContainer>
            <FlexContainer>
              {candidateIDs.map(id => (
                <ListingCard
                  key={id}
                  one={candidates.get(id)}
                  listingType={'candidates'}
                  openSidePanel={openSidePanel}
                  handleUpdateStatus={handleUpdateStatus}
                  updateTrigger={candidates.getIn([id, 'appExpiry', 'expired'])}
                  tokenData={candidates.getIn([id, 'tokenData'])}
                />
              ))}
            </FlexContainer>
          </TabContainer>
        )}

        {value === 2 && (
          <TabContainer>
            <FlexContainer>
              {faceoffIDs.map(id => (
                <ListingCard
                  key={id}
                  one={faceoffs.get(id)}
                  listingType={'faceoffs'}
                  openSidePanel={openSidePanel}
                  handleUpdateStatus={handleUpdateStatus}
                  updateTrigger={faceoffs.getIn([id, 'revealExpiry', 'expired'])}
                  revealTrigger={faceoffs.getIn([id, 'commitExpiry', 'expired'])}
                  tokenData={faceoffs.getIn([id, 'tokenData'])}
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
