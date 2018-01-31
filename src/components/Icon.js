import React from 'react'

import globe from '../assets/icons/globe.svg'
import download from '../assets/icons/download.svg'
import unlock from '../assets/icons/unlock.svg'
import user from '../assets/icons/user.svg'
import xCircle from '../assets/icons/x-circle.svg'
import trendingUp from '../assets/icons/trending-up.svg'
import zap from '../assets/icons/zap.svg'
import { colors } from '../colors'

const icons = {
  globe,
  download,
  unlock,
  user,
  xCircle,
  zap,
  trendingUp,
}

export default props => {
  const style = {
    display: 'inline-block',
    verticalAlign: 'middle',
    backgroundColor: `${colors.blue1}`,
  }

  return <img src={icons[props.iconName]} alt={props.iconName} style={style} />
}
