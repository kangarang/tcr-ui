import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Button from '../Button'
import { colors } from '../Colors'

const FormComponent = styled.form`
  padding: 2em;
`
const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.4);
  border: none;
  border-bottom: 2px solid ${colors.prism};
  font-size: 1em;
  padding: 0.75em;
  color: white;
`

function Form(props) {
  return (
    <FormComponent onSubmit={props.onSubmit}>
      <div>
        <Input
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onSubmit={props.onSubmit}
        />
        <Button onClick={props.onSubmit}>
          <h4>{'S U B M I T'}</h4>
        </Button>
      </div>
    </FormComponent>
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
