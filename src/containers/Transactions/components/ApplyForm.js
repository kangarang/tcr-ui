import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'

const Form = props => {
  const { handleCustomSubmit } = props
  return (
    <form onSubmit={handleCustomSubmit}>
      <div>
        <label htmlFor="listingID">Listing ID</label>
        <Field name="listingID" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="data">URL</label>
        <Field name="data" component="input" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

const ReduxForm = reduxForm({
  form: 'application',
})(Form)

export default ReduxForm
