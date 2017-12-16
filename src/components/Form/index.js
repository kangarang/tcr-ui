import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Button from '../Button'
const FormComponent = styled.form`
  margin-bottom: 1em;
`
const Input = styled.input`
  /* background-color: rgba(0, 0, 0, 0.1); */
  border-bottom: 1px solid #52427c;
`

function Form(props) {
  return (
    <div>
      <FormComponent onSubmit={props.onSubmit}>
        <label htmlFor="domain">
          <Input
            id={props.id}
            type="text"
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
          />
        </label>
        <Button onClick={props.onSubmit}>
          <h4>{'apply(domain, deposit)'}</h4>
        </Button>
      </FormComponent>
    </div>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
}

export default Form
