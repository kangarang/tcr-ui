// https://github.com/aragon/aragon-ui/tree/master/src/components/Countdown
import React from 'react'
import styled from 'styled-components'

import redraw from './redraw'
import IconTime from './Time'

import { difference, formatHtmlDatetime } from 'utils/_datetime'
import { unselectable } from 'utils/_styles'
import { colors } from '../global-styles'

const FRAME_EVERY = 1000 / 30 // 30 FPS is enough for a ticker

const formatUnit = v => String(v).padStart(2, '0')

const Countdown = ({ end }) => {
  const { days, hours, minutes, seconds, totalInSeconds } = difference(end, new Date())
  if (totalInSeconds < 0) {
    return false
  }

  return (
    <Main dateTime={formatHtmlDatetime(end)}>
      <IconWrapper>
        <IconTime />
      </IconWrapper>
      {totalInSeconds > 0 ? (
        <span>
          {days !== 0 && (
            <Part>
              {formatUnit(days)}
              <Unit>D</Unit>
              <Separator />
            </Part>
          )}
          {hours !== 0 && (
            <Part>
              {formatUnit(hours)}
              <Unit>H</Unit>
              <Separator>:</Separator>
            </Part>
          )}
          {minutes !== 0 && (
            <Part>
              {formatUnit(minutes)}
              <Unit>M</Unit>
              <Separator>:</Separator>
            </Part>
          )}
          {seconds !== 0 && (
            <Part>
              {formatUnit(seconds)}
              <Unit>S</Unit>
            </Part>
          )}
        </span>
      ) : (
        <TimeOut>Time out</TimeOut>
      )}
    </Main>
  )
}

const Main = styled.time`
  width: 12em;
  white-space: nowrap;
  ${unselectable()};
`

const IconWrapper = styled.span`
  margin-right: 15px;
`

const Part = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.offBlackj};
`

const Separator = styled.span`
  margin: 0 4px;
  color: ${colors.offBlack};
  font-weight: 400;
`

const Unit = styled.span`
  margin-left: 2px;
  font-size: 12px;
  color: ${colors.offBlack};
`

const TimeOut = styled.span`
  font-weight: 600;
  color: ${colors.offBlack};
`

export default redraw(FRAME_EVERY)(Countdown)
