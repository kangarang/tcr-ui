import React from 'react'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

function CircularIndeterminate(props) {
  const { classes } = props
  return (
    <div>
      <CircularProgress className={classes.progress} size={75} color="secondary" />
    </div>
  )
}

export default withStyles(styles)(CircularIndeterminate)
