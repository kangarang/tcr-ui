import React from 'react'
import styled from 'styled-components'

const BannerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4em;
  font-family: 'Avenir Next';
  padding: 2em;
`

const Banner = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 1.75em;
  font-weight: 600;
  text-align: center;
  width: 500px;
`

export default () => (
  <BannerWrapper>
    <Banner>Neque porro quisquam est qui dolorem ipsum quia</Banner>
  </BannerWrapper>
)
