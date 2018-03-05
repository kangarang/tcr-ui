import React, { Component } from 'react'
import JSONTree from 'react-json-tree'
import { TableRow, TableCell, Text, ContextMenu, Countdown } from '@aragon/ui'
import { Icon } from 'semantic-ui-react'

import { jsonTheme } from '../colors'
import { CMItem } from './Home/components/StyledHome'
import { dateHasPassed } from '../utils/format-date'
import { toUnitAmount } from '../utils/units_utils'

export default class ListingRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false,
    }
  }

  handleToggleExpandDetails = listingHash => {
    this.setState(prevState => ({
      expand: !prevState.expand,
    }))
  }

  render() {
    return (
      <TableRow
        key={this.props.listingHash}
        onClick={this.handleToggleExpandDetails}
      >
        {/* stats */}
        <TableCell>
          <Text>{this.props.listing.get('listingString')}</Text>
        </TableCell>
        <TableCell>
          {!dateHasPassed(this.props.listing.getIn(['appExpiry', 'date'])) ? (
            <Countdown end={this.props.listing.getIn(['appExpiry', 'date'])} />
          ) : (
            'Ready to update'
          )}
        </TableCell>
        <TableCell>
          {this.state.expand && (
            <JSONTree
              invertTheme={false}
              theme={jsonTheme}
              data={this.props.listing}
              keyName={'root'}
              level={0}
            />
          )}
        </TableCell>
        <TableCell>
          {toUnitAmount(
            this.props.parameters.get('minDeposit'),
            this.props.token.decimals
          ).toString()}
        </TableCell>
        <TableCell>
          <div>
            <Icon name="exclamation circle" size="large" color="yellow" />
            {this.props.listing.get('owner') === this.props.account && (
              <Icon name="check circle" size="large" color="blue" />
            )}
          </div>
        </TableCell>

        {/* actions */}
        <TableCell>
          <ContextMenu>
            {this.props.listing.get('appExpired') && (
              <CMItem
                onClick={e =>
                  this.props.handleSendTransaction(
                    'updateStatus',
                    this.props.listing
                  )
                }
              >
                <Icon name="magic" size="large" color="purple" />
                {'Update Status'}
              </CMItem>
            )}
            <CMItem
              onClick={e =>
                this.props.openSidePanel(this.props.listing, 'openChallenge')
              }
            >
              <Icon name="exclamation circle" size="large" color="red" />
              {'Challenge Listing'}
            </CMItem>
          </ContextMenu>
        </TableCell>
      </TableRow>
    )
  }
}
