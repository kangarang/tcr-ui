import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import Listing from './Listing'
import styled from 'styled-components'

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
    const { classes, candidates, faceoffs, whitelist } = this.props
    const { value } = this.state

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="black"
            textColor="black"
            // fullWidth
          >
            <Tab label="registry" />
            <Tab label="for challenge" />
            <Tab label="for voting" href="#basic-tabs" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <FlexContainer>
              {whitelist.map(one => (
                <Listing
                  listingHash={one.get('listingHash')}
                  ipfsID={one.get('ipfsID')}
                  imgSrc={''}
                  owner={one.get('owner')}
                  latest={one.get('latest')}
                />
              ))}
            </FlexContainer>
          </TabContainer>
        )}
        {value === 1 && <TabContainer>For Challenge</TabContainer>}
        {value === 2 && <TabContainer>For Voting</TabContainer>}
      </div>
    )
  }
}
const FlexContainer = styled.div`
  display: flex;
`

export default withStyles(styles)(SimpleTabs)
