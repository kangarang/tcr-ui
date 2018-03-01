import React from 'react'
import Input from '../../../components/Input'
import H3 from '../../../components/H3'
import Button from '../../../components/Button'
import translate, { translateRaw } from '../../../translations/index'
import styled from 'styled-components'
import { colors } from '../../../colors'
// import { BN, toUnitAmount } from '../../../utils/units_utils';

const styles = {
  udappMethod: {
    minWidth: '33%',
  },
}

const MethodDescription = styled.div`
  padding: 0 1em;
`
const ColorH3 = styled(H3) `
  color: ${colors.lightBlue};
`

// adapted from:
// https://github.com/kumavis/udapp/blob/master/index.js#L310
const Method = props => {
  let hiddenInputs
  if (props.method.name !== 'commitVote' || props.method.name !== 'revealVote') {
    hiddenInputs = ['_data', '_pollID', '_prevPollID']
  } else {
    hiddenInputs = ['_data', '_prevPollID']
  }
  return (
    <div key={props.method.name} style={styles.udappMethod}>
      <ColorH3>{`${props.method.name}`}</ColorH3>

      <MethodDescription>
        <div>
          {props.method.constant ? translate(`call_${props.method.name}`) : translate(`tx_${props.method.name}`)}
        </div>
      </MethodDescription>

      {/* <MethodDescription>
        <div>
          {translateRaw(`ins_${props.method.name}`)}
        </div>
      </MethodDescription> */}
      {props.method.inputs.map((input, ind) => (
        <form
          key={input.name + ind + props.method.name}
          onSubmit={e =>
            props.method.constant
              ? props.hocCall(e, props.method, props.contract)
              : props.hocSendTransaction(e, props.method, props.contract)
          }
        >
          {!hiddenInputs.includes(input.name) && (
            <Input
              id={input.name}
              placeholder={translateRaw(`input${input.name}`)}
              // defaultValue={
                // input.name === '_voter' || input.name === '_owner'
                //   ? `${props.account}`
                //   : input.name === '_listingHash'
                    // ? props.request.getIn(['context', 'listing'])
                    // : ''
              // }
              onChange={e => props.hocInputChange(e, props.method, input)}
            />
          )}
        </form>
      ))}

      {props.method.constant ? (
        <Button onClick={e => props.hocCall(e, props.method, props.contract)}>
          {'CALL'}
        </Button>
      ) : (
          <Button
            onClick={e =>
              props.hocSendTransaction(e, props.method, props.contract)
            }
          >
            {'SEND TXN'}
          </Button>
        )}

      {props.method.constant &&
        props.currentMethod === props.method.name &&
        ` -> ${props.callResult}`}
      <br />
      <br />
    </div>
  )
}

export default Method
