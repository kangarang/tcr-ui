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
              {whitelist
                .valueSeq()
                .map(one => (
                  <ListingMediaCard
                    key={one.get('listingHash')}
                    one={one}
                    imgSrc={imgSrc}
                    listingType={'whitelist'}
                    openSidePanel={openSidePanel}
                    chooseTCR={chooseTCR}
                    registry={registry}
                    tokenData={one.get('tokenData')}
                  />
                ))}
            </FlexContainer>
          </TabContainer>
        )}

        {value === 1 && (
          <TabContainer>
            <FlexContainer>
              {candidates
                .valueSeq()
                .map(one => (
                  <ListingMediaCard
                    key={one.get('listingHash')}
                    one={one}
                    imgSrc={imgSrc}
                    listingType={'candidates'}
                    openSidePanel={openSidePanel}
                    handleUpdateStatus={handleUpdateStatus}
                    updateTrigger={one.getIn(['appExpiry', 'expired'])}
                    tokenData={one.get('tokenData')}
                  />
                ))}
            </FlexContainer>
          </TabContainer>
        )}

        {value === 2 && (
          <TabContainer>
            <FlexContainer>
              {faceoffs.valueSeq().map(one => (
                <ListingMediaCard
                  key={one.get('listingHash')}
                  one={one}
                  imgSrc={imgSrc}
                  listingType={'faceoffs'}
                  openSidePanel={openSidePanel}
                  handleUpdateStatus={handleUpdateStatus}
                  // updateTrigger={one.getIn(['revealExpiry', 'expired'])}
                  updateTrigger={true}
                  revealTrigger={one.getIn(['commitExpiry', 'expired'])}
                  // revealTrigger={true}
                  tokenData={one.get('tokenData')}
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
