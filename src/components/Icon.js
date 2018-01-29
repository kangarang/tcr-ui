import React from 'react'

import globe from '../assets/icons/globe.svg'
import download from '../assets/icons/download.svg'
import unlock from '../assets/icons/unlock.svg'
import user from '../assets/icons/user.svg'
import xCircle from '../assets/icons/x-circle.svg'
import trendingUp from '../assets/icons/trending-up.svg'
import zap from '../assets/icons/zap.svg'
import {colors} from './Colors'

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
  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    path: {
      fill: props.color,
    },
    img: {
      backgroundColor: `${colors.blue1}`
    }
  }

  return (
    // <svg
    //   style={styles.svg}
    //   width={10}
    //   height={10}
    //   // width={`${props.size}px`}
    //   // height={`${props.size}px`}
    //   viewBox="0 0 1024 1024"
    // >
    //   <path style={styles.path} d={icons.globe} />
    // </svg>
    <img src={icons[props.iconName]} style={styles.img} />
  )
}
