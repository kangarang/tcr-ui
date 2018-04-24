import React from 'react'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'

import ConsenSys from 'views/components/Loading/ConsenSys'

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
      {/* <ConsenSys height={40} width={40} classes={'logo spin'} /> */}
    </div>
  )
}

export default withStyles(styles)(CircularIndeterminate)
