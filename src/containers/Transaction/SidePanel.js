// from: https://github.com/aragon/aragon-ui/blob/master/src/components/SidePanel/SidePanel.js
import React, { Component } from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { Text } from '@aragon/ui'

import close from 'assets/close.svg'
import { unselectable } from 'utils/_styles'
import { getPublicUrl, prefixUrl } from 'utils/_url'

const PANEL_WIDTH = 450
const PANEL_OVERFLOW = PANEL_WIDTH * 0.2
const PANEL_HIDE_RIGHT = -PANEL_WIDTH * 1.6
const CONTENT_PADDING = 30
const PANEL_INNER_WIDTH = PANEL_WIDTH - CONTENT_PADDING * 2

const StyledSidePanel = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: ${({ opened }) => (opened ? 'auto' : 'none')};
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(68, 81, 89, 0.65);
  pointer-events: ${({ opened }) => (opened ? 'auto' : 'none')};
`

const StyledPanel = styled.aside`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  width: ${PANEL_WIDTH + PANEL_OVERFLOW}px;
  height: 100vh;
  padding-right: ${PANEL_OVERFLOW}px;
  background: white;
  box-shadow: -2px 0 36px rgba(0, 0, 0, 0.2);
`

const StyledPanelHeader = styled.header`
  position: relative;
  padding-top: 15px;
  padding-left: ${CONTENT_PADDING}px;
  padding-right: 20px;
  padding-bottom: 15px;
  ${unselectable()};
`

const StyledPanelScrollView = styled.div`
  overflow-y: auto;
`

const StyledPanelContent = styled.div`
  padding-right: ${CONTENT_PADDING}px;
  padding-left: ${CONTENT_PADDING}px;
  padding-bottom: ${CONTENT_PADDING}px;
`

const StyledPanelCloseButton = styled.button`
  ${StyledPanelHeader} & {
    position: absolute;
    padding: 20px;
    top: 0;
    right: 0;
    cursor: pointer;
    background: none;
    border: 0;
    outline: 0;
    &::-moz-focus-inner {
      border: 0;
    }
  }
`

class SidePanel extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleEscape, false)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscape, false)
  }
  handleClose = () => {
    if (!this.props.blocking) {
      this.props.onClose()
    }
  }
  handleEscape = event => {
    if (event.keyCode === 27 && this.props.opened) {
      this.handleClose()
    }
  }
  handleMotionRest = () => {
    // this.props.onTransitionEnd(this.props.opened)
  }

  // from: https://github.com/aragon/aragon-ui/blob/master/src/utils/math.js
  motionStyles = progress => {
    function lerp(progress, value1, value2) {
      return (value2 - value1) * progress + value1
    }
    return {
      overlay: { opacity: progress },
      panel: {
        right: `${lerp(progress, PANEL_HIDE_RIGHT, -PANEL_OVERFLOW)}px`,
      },
    }
  }

  // from: https://github.com/aragon/aragon-ui/blob/master/src/utils/styles/spring.js
  springConf = name => {
    const SPRINGS = {
      slow: { stiffness: 150, damping: 18, precision: 0.001 },
      normal: { stiffness: 190, damping: 22, precision: 0.001 },
      fast: { stiffness: 220, damping: 24, precision: 0.001 },
    }
    return SPRINGS[name] || SPRINGS.normal
  }

  render() {
    const { children, title, opened, blocking, publicUrl } = this.props
    return (
      <Motion
        style={{ progress: spring(Number(opened), this.springConf('slow')) }}
        onRest={this.handleMotionRest}
      >
        {({ progress }) => {
          const styles = this.motionStyles(progress)
          return (
            <StyledSidePanel hidden={progress === 0} opened={opened}>
              <Overlay
                opened={opened}
                style={styles.overlay}
                onClick={this.handleClose}
              />
              <StyledPanel style={styles.panel}>
                <StyledPanelHeader>
                  <h1>
                    <Text size="xxlarge">{title}</Text>
                  </h1>
                  {!blocking && (
                    <StyledPanelCloseButton
                      type="button"
                      onClick={this.handleClose}
                    >
                      <img src={prefixUrl(close, publicUrl)} alt="Close" />
                    </StyledPanelCloseButton>
                  )}
                </StyledPanelHeader>
                <StyledPanelScrollView>
                  <StyledPanelContent>{children}</StyledPanelContent>
                </StyledPanelScrollView>
              </StyledPanel>
            </StyledSidePanel>
          )
        }}
      </Motion>
    )
  }
}

const WrappedSidePanel = getPublicUrl(SidePanel)

WrappedSidePanel.PANEL_WIDTH = PANEL_WIDTH
WrappedSidePanel.PANEL_OVERFLOW = PANEL_OVERFLOW
WrappedSidePanel.PANEL_HIDE_RIGHT = PANEL_HIDE_RIGHT
WrappedSidePanel.PANEL_INNER_WIDTH = PANEL_INNER_WIDTH
WrappedSidePanel.HORIZONTAL_PADDING = CONTENT_PADDING

export default WrappedSidePanel
