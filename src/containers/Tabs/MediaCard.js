import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
// import Button from 'material-ui/Button'
import Button from 'components/Button'
import Typography from 'material-ui/Typography'

const styles = {
  card: {
    width: 150,
    margin: 5,
  },
  media: {
    height: 150,
  },
}

function MediaCard(props) {
  const {
    imgSrc,
    classes,
    // listingHash,
    // one,
    ipfsID,
    // ipfsData,
    owner,
    latest,
    openSidePanel,
    // chooseTCR,
    actionCopy,
    // listingType,
  } = props

  return (
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

        <Typography component="p">{`BY: ${owner.substring(0, 8)}`}</Typography>
        <Typography component="p">{latest.get('timesince')}</Typography>
      </CardContent>

      <CardActions>
        <Button onClick={openSidePanel} size="medium" color="primary">
          {actionCopy}
        </Button>
        {/* <Button onClick={e => chooseTCR(ipfsData)}>{'Choose this TCR'}</Button> */}
      </CardActions>
    </Card>
  )
}

export default withStyles(styles)(MediaCard)
