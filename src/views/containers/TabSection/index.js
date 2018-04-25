import React, { Component } from 'react'
import { connect } from 'react-redux'
import Notifications from 'react-notification-system-redux'

import Header from 'view/components/Header'
// import Footer from 'view/components/Footer'
import { selectNetwork } from 'redux/modules/home/selectors'

const notificationStyle = {
  NotificationItem: {
    DefaultStyle: {
      margin: '10px 5px 2px 5px',
      width: '400px',
    },
    info: {
      // color: 'black',
      // backgroundColor: 'white',
    },
  },
}
class TabSection extends Component {
  render() {
    const { children, network } = this.props

    return (
      <div className="TabSection">
        {/* <Query
          params={['network']}
          withQuery={({ network }) => (
            <Header networkParam={network && `${network.toLowerCase()}_auto`} />
          )}
        /> */}
        <Header networkParam={network && `${network.toLowerCase()}_auto`} />

        <div className="Tab container">{children}</div>

        <div className="TabSection-spacer" />
        {/* <Footer latestBlock={latestBlock} /> */}
        <Notifications
          style={notificationStyle}
          notifications={this.props.notifications}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    // isOffline: getOffline(state),
    // latestBlock: getLatestBlock(state),
    network: selectNetwork,
    tcr: selectTCR,
    notifications: selectNotifications,
  }
}

export default connect(mapStateToProps, {})(TabSection)
