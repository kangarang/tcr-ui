import React from 'react'

// from: https://github.com/aragon/aragon-ui/blob/master/src/public-url.js
// High order component wrapper
export const getPublicUrl = Component => {
  const highOrderComponent = (baseProps, context) => {
    const { publicUrl = '' } = context
    const props = { ...baseProps, publicUrl }
    return <Component {...props} />
  }
  return highOrderComponent
}
// prefix helper
export const prefixUrl = (url, publicUrl) =>
  url.startsWith('data:') ? url : publicUrl + url