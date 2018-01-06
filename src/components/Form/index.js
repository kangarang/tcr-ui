import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Button from '../Button'
import { colors } from '../Colors'

const FormComponent = styled.form`
  /* margin-bottom: 1em; */
  padding: 2em;
`
const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-bottom: 2px solid ${colors.purple};
  font-size: 1em;
  padding: .75em;
  color: white;
`

function Form(props) {
  return (
    <FormComponent onSubmit={props.onSubmit}>
      {'ConsenSys Ad Tech membership requires a minimum deposit of 50,000 Cat Token (CATT).'}
      <br />
      {'Please use this form to apply for CAT membership: '}
      {/* <div>
        <Input
          id={props.idAmount}
          type="number"
          placeholder={'Enter amount'}
          value={props.amountValue}
          onChange={props.onChangeAmount}
        />
      </div> */}
      <div>
        <Input
          id={props.id}
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onSubmit={props.onSubmit}
        />
        <Button onClick={props.onSubmit}>
          <h4>{'Submit'}</h4>
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
