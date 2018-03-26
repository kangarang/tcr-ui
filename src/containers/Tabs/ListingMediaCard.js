import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'

import Button from 'components/Button'
import Countdown from 'components/Countdown'

const styles = {
  card: {
    width: 240,
    margin: 5,
    padding: '1em',
  },
  media: {
    height: 140,
    margin: 5,
  },
}

function ListingMediaCard(props) {
  const {
    imgSrc,
    one,
    classes,
    openSidePanel,
    chooseTCR,
    handleUpdateStatus,
    registry,
    listingType,
    updateTrigger,
    revealTrigger,
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={imgSrc}
          title={`Listing image ${one.get('ipfsID')}`}
        />

        <CardContent>
          <Typography variant="title" component="h3">
            {one.get('ipfsID')}
          </Typography>

          <Typography component="p">{`BY: ${one.get('owner').substring(0, 8)}`}</Typography>
          <Typography component="p">{one.getIn(['appExpiry', 'formattedLocal'])}</Typography>
        </CardContent>

        <CardActions>
          <div>
            {listingType === 'faceoffs' ? (
              <div>
                {!revealTrigger &&
                  !updateTrigger && (
                    <div>
                      <Button
                        onClick={e => openSidePanel(one, 'commitVote')}
                        size="medium"
                        color="primary"
                      >
                        {'Commit Vote'}
                      </Button>
                      <Countdown end={one.getIn(['latest', 'commitExpiry', 'date'])} />
                    </div>
                  )}
                {revealTrigger &&
                  !updateTrigger && (
                    <div>
                      <Button
                        onClick={e => openSidePanel(one, 'revealVote')}
                        size="medium"
                        color="primary"
                      >
                        {'Reveal Vote'}
                      </Button>
                      <Countdown end={one.getIn(['latest', 'revealExpiry', 'date'])} />
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <Button
                  onClick={e => openSidePanel(one, 'challenge')}
                  size="medium"
                  color="primary"
                >
                  {'Challenge'}
                </Button>
                <Countdown end={one.getIn(['appExpiry', 'date'])} />
              </div>
            )}
            {registry && registry.address === '0xeac7a44f139dde706126d1c5947945daf999dc3f' ? (
              <Button onClick={e => chooseTCR(one.get('ipfsData'))}>{'Select TCR'}</Button>
            ) : (
              updateTrigger && (
                <div>
                  <Button onClick={e => handleUpdateStatus(one)} size="medium" color="primary">
                    {'Update Status'}
                  </Button>
                </div>
              )
            )}
          </div>
        </CardActions>
      </Card>
    </div>
  )
}

export default withStyles(styles)(ListingMediaCard)
