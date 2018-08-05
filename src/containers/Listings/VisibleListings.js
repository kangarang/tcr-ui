import * as React from 'react'

function VisibileListings({ visibleListings }) {
  return (
    <div>
      {JSON.stringify(visibleListings)}
      {/* {visibleListings.map(li => (
        <div>{li.listingID}</div>
      ))} */}
    </div>
  )
}

export default VisibileListings
