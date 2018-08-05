import React from 'react'
import FilterLink from './FilterLink'

const FilterLinks = () => {
  return (
    <div>
      Show: <FilterLink filter="applications">Applications</FilterLink>
      {', '}
      <FilterLink filter="whitelist">whitelist</FilterLink>
      {', '}
      <FilterLink filter="faceoffs">Faceoffs</FilterLink>
    </div>
  )
}

export default FilterLinks
