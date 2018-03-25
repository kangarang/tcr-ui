import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
// import Button from 'material-ui/Button'
import Button from 'components/Button'
import Typography from 'material-ui/Typography'

const styles = {
  card: {
    width: 190,
    margin: 5,
    padding: '1em',
  },
  media: {
    height: 140,
    margin: 5,
  },
}

function MediaCard(props) {
  const {
    imgSrc,
    classes,
    ipfsID,
    ipfsData,
    owner,
    latest,
    openSidePanel,
    chooseTCR,
    actionCopy,
    handleSendTransaction,
    registry,
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={imgSrc}
          title={`Listing image ${ipfsID}`}
        />

        <CardContent>
          <Typography variant="title" component="h3">
            {ipfsID}
          </Typography>

          <Typography component="p">{`BY: ${owner.substring(
            0,
            8
          )}`}</Typography>
          <Typography component="p">{latest.get('timesince')}</Typography>
        </CardContent>

        <CardActions>
          {registry && registry.address === '0xeac7a44f139dde706126d1c5947945daf999dc3f' ? (
            <Button onClick={e => chooseTCR(ipfsData)}>{'Select TCR'}</Button>
          ) : handleSendTransaction ? (
            <Button
              onClick={handleSendTransaction}
              size="medium"
              color="primary"
            >
              {'Update Status'}
            </Button>
          ) : (
            <Button onClick={openSidePanel} size="medium" color="primary">
              {actionCopy}
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  )
}

export default withStyles(styles)(MediaCard)
