import React from 'react'
import styled from 'styled-components'

import Img from 'components/Img'

const ListingDetails = styled.div`
  display: flex;
  padding: 2em 0;
`
const ListingIconSquare = styled.div`
  height: 90px;
  width: 90px;
  border: 1px solid black;
`
const ListingInfoColumn = styled.div`
  margin-left: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 1.2em;
`
const ListingTitle = styled.div`
  font-weight: 600;
`
const ListingCountdown = styled.div`
  color: #fb8414;
  font-weight: 500;
`

function DetailsSection({ listing }) {
  return (
    <ListingDetails>
      <ListingIconSquare>
        {listing.listingData && <Img src={listing.listingData} alt="" />}
      </ListingIconSquare>

      <ListingInfoColumn>
        <ListingTitle>{listing.listingID}</ListingTitle>

        <ListingCountdown>
          <div>Vote Ends In</div>
          <div>00 : 20 : 00</div>
        </ListingCountdown>
      </ListingInfoColumn>
    </ListingDetails>
  )
}

export default DetailsSection
