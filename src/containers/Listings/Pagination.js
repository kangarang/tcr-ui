import React from 'react'
import { withStyles } from 'material-ui/styles'

import IconButton from 'material-ui/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.textSecondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
  prevPage: {
    position: 'fixed',
    left: '30px',
    top: '45%',
    height: '5em',
    width: '5em',
  },
  nextPage: {
    position: 'fixed',
    right: '30px',
    top: '45%',
    height: '5em',
    width: '5em',
  },
})

class TablePaginationActions extends React.Component {
  componentDidMount() {
    this.handleKeyPress()
  }
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  }
  handleKeyPress = () => {
    document.addEventListener('keydown', e => {
      if (e.code === 'ArrowLeft' && this.props.page !== 0) {
        this.handleBackButtonClick(e)
      } else if (
        e.code === 'ArrowRight' &&
        !(this.props.page >= Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
      ) {
        this.handleNextButtonClick(e)
      }
    })
  }

  render() {
    const { classes, count, page, rowsPerPage } = this.props

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
          className={classes.prevPage}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
          className={classes.nextPage}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    )
  }
}

export default withStyles(actionsStyles)(TablePaginationActions)
