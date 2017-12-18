import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Button from '../Button'
import { colors } from '../Colors'

const FormComponent = styled.form`
  /* margin-bottom: 1em; */
`
const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  border-bottom: 1px solid ${colors.magenta};
  padding: 1em;
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
          <h4>{'Submit'}</h4>
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
