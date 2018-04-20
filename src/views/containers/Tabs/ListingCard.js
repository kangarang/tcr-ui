import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card, { CardActions, CardContent } from 'material-ui/Card'

import Button from 'views/components/Button'
import Img from 'views/components/Img'
import Countdown from 'views/components/Countdown'

import imgSrc from 'views/assets/icons/eth.png'

const styles = {
  card: {
    width: 240,
    margin: 5,
    padding: '1em',
  },
  media: {
    height: 100,
    margin: 5,
  },
}

function ListingCard(props) {
  const {
    one,
    classes,
    registry,
    tokenData,
    listingType,
    updateTrigger,
    revealTrigger,
    openSidePanel,
    chooseTCR,
    handleUpdateStatus,
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <Img src={tokenData.get('imgSrc') ? tokenData.get('imgSrc') : imgSrc} alt="" />

        <CardContent>
          <Typography variant="title" component="h3">
            {tokenData.get('name')
              ? tokenData.get('name')
              : one.get('listingID') && one.get('listingID')}
          </Typography>

          <Typography component="p">{`BY: ${one.get('owner').substring(0, 10)}`}</Typography>
          <Typography component="p">{one.getIn(['appExpiry', 'formattedLocal'])}</Typography>
        </CardContent>

        <CardActions>
          <div>
            {listingType === 'faceoffs' ? (
              <div>
                {!revealTrigger && !updateTrigger ? (
                  <div>
                    <Button
                      onClick={e => openSidePanel(one, 'commitVote')}
                      size="medium"
                      color="primary"
                    >
                      {'Commit Vote'}
                    </Button>
                    <Countdown end={one.getIn(['commitExpiry', 'date'])} />
                  </div>
                ) : (
                  revealTrigger &&
                  !updateTrigger && (
                    <div>
                      <Button
                        onClick={e => openSidePanel(one, 'revealVote')}
                        size="medium"
                        color="primary"
                      >
                        {'Reveal Vote'}
                      </Button>
                      <Countdown end={one.getIn(['revealExpiry', 'date'])} />
                    </div>
                  )
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
            {registry && registry.address === '0x9fc1917a8ba87db75e308c9de45d99813f63e64a' ? (
              <Button onClick={e => chooseTCR(one.get('listingID'))}>{'Select TCR'}</Button>
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

export default withStyles(styles)(ListingCard)
