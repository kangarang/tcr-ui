import React from 'react'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import styled from 'styled-components';

const styles = {
  card: {
    width: 180,
  },
  media: {
    height: 80,
  },
}

function SimpleMediaCard(props) {
  const { imgSrc, classes, listingHash, ipfsID, owner, latest } = props
  return (
      <Card className={classes.card} key={listingHash}>
        <CardMedia
          className={classes.media}
          image={imgSrc}
          title="image title"
        />
        <CardContent>
          <Typography variant="title" component="h3">
            {ipfsID}
          </Typography>

          <Typography component="p">{`BY: ${owner.substring(0, 8)}...`}</Typography>
          <Typography component="p">{latest.get('timesince')}</Typography>
        </CardContent>

        <CardActions>
          <Button size="medium" color="primary">
            Challenge
          </Button>
        </CardActions>
      </Card>
  )
}

export default withStyles(styles)(SimpleMediaCard)
