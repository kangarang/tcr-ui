import React, { Component } from 'react'
import { connect } from 'react-redux'
import Particles from 'react-particles-js'
import styled from 'styled-components'

const FixedOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 2000;
`
const OverlayContent = styled.div`
  margin: auto;
  width: 50%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: white;
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

class MiningOverlay extends Component {
  render() {
    console.log('this.props', this.props)
    const { open, message } = this.props

    return (
      <span>
        {open &&
          <FixedOverlay>
            <Particles
              params={{
                particles: {
                  line_linked: {
                    shadow: {
                      enable: true,
                      color: "#3CA9D1",
                    },
                    width: 2,
                    distance: 250,
                    opacity: 0.4,
                  },
                  number: {
                    value: 50,
                  },
                  move: {
                    speed: 8,
                  }
                },
              }}
            />

            <OverlayContent>
              <h2>{message}</h2>
              <h3>{'Please wait while transaction is confirmed & added to the blockchain'}</h3>
            </OverlayContent>
          </FixedOverlay>
        }
      </span>
    )
  }
}

export default connect(
  (state) => ({
    miningStatus: state.miningStatus,
  })
)(MiningOverlay)