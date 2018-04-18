// adapted from:
// https://github.com/aragon/aragon-ui/blob/master/src/utils/styles/grid.js
// https://github.com/aragon/aragon-ui/blob/master/src/components/Section/Section.js
import React from 'react'
import styled from 'styled-components'

const GRID = {
  columns: 12,
  gutterWidth: 30,
  columnWidth: 68,
}

export const grid = (cols, gutters = cols - 1) =>
  GRID.columnWidth * cols + GRID.gutterWidth * gutters

const StyledContent = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: ${({ large }) => grid(large ? 12 : 10)}px;
`

const Section = ({ large, visual, className, publicUrl, ...props }) => {
  const containerProps = { className }
  const content = (
    <StyledContent large={large}>
      <div {...props} />
    </StyledContent>
  )
  if (visual) return <div {...containerProps}>{content}</div>
  return <section {...containerProps}>{content}</section>
}

Section.defaultProps = {
  large: false,
  visual: false,
}

export default Section
