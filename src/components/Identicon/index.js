import React from 'react'
import PropTypes from 'prop-types'
import blockies from 'blockies'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
`

function Identicon(props) {
  const owner = props.owner || ''
  const size = props.size || 8
  const scale = props.scale || 8

  const dataUrl = blockies({
    // lowercase it in case it's a checksummedaccount
    seed: owner.toLowerCase(),
    size,
    scale,
  }).toDataURL()

  return (
    <Container>
      <img src={dataUrl} alt="" />
    </Container>
  )
}

Identicon.propTypes = {
  owner: PropTypes.string,
  size: PropTypes.number,
  scale: PropTypes.number,
}

export default Identicon
