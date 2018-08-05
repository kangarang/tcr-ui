import * as React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import toJS from 'components/toJS'
import { makeSelectVisibleListings } from 'modules/listings/selectors'

function VisibleListings({ visibleListings }) {
  return (
    <div>
      {JSON.stringify(visibleListings)}
      {/* {visibleListings.map(li => (
        <div>{li.listingID}</div>
      ))} */}
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  visibleListings: makeSelectVisibleListings(),
})

const withConnect = connect(mapStateToProps)

export default compose(
  withRouter,
  withConnect
)(toJS(VisibleListings))
