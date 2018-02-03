import React from 'react'
import Input from '../../../components/Input'
import H3 from '../../../components/H3'
import Button from '../../../components/Button'
import translate from '../../../translations/index'
import styled from 'styled-components'

const styles = {
  udappMethod: {
    minWidth: '33%',
  },
}

const MethodDescription = styled.div`
  padding: 0 2em;
`

// adapted from:
// https://github.com/kumavis/udapp/blob/master/index.js#L310
const Method = props => {
  return (
    <div key={props.method.name} style={styles.udappMethod}>
      <H3>{`Function: ${props.method.name}`}</H3>

      <MethodDescription>
        {props.method.constant ? (
          <div>{translate(`call_${props.method.name}`)}</div>
        ) : (
          <div>{translate(`tx_${props.method.name}`)}</div>
        )}
      </MethodDescription>

      {props.method.inputs.map((input, ind) => (
        <form
          key={input.name + ind + props.method.name}
          onSubmit={e =>
            props.method.constant
              ? props.hocCall(e, props.method, props.contract)
              : props.hocSendTransaction(e, props.method, props.contract)
          }
        >
          {input.name !== '_data' ? (
            // TODO: enable so that the defaultValue actually works without
            // ...having to re-input
            <Input
              id={input.name}
              placeholder={`${input.name} (${input.type})`}
              defaultValue={
                input.name === '_voter' || input.name === '_owner'
                  ? `${props.account}`
                  : input.name === '_listingHash'
                    ? props.request.getIn(['context', 'listing'])
                    : ''
              }
              onChange={e => props.hocInputChange(e, props.method, input)}
            />
          ) : (
            false
          )}
        </form>
      ))}
      {props.method.constant ? (
        <Button onClick={e => props.hocCall(e, props.method, props.contract)}>
          {'CALL'}
        </Button>
      ) : (
        <Button onClick={e => props.hocSendTransaction(e, props.method, props.contract)}>
          {'SEND TXN'}
        </Button>
      )}
      {props.method.constant && props.currentMethod === props.method.name
        ? ` -> ${props.callResult}`
        : false}
      <br />
      <br />
    </div>
  )
}

export default Method
