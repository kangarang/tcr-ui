import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { colors } from 'views/global-styles'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  background: ${colors.blue2};
`
const Image = styled.img`
  mix-blend-mode: multiply;
  filter: greyscale(100%);
  width: 100%;
`
function Img(props) {
  return (
    <Container>
      {props.wrapper ? (
        <Wrapper>
          <Image className={props.className} src={props.src} alt={props.alt} />
        </Wrapper>
      ) : (
        <Image className={props.className} src={props.src} alt={props.alt} />
      )}
    </Container>
  )
}

// We require the use of src and alt, only enforced by react in dev mode
Img.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default Img
