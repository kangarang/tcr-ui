import { select, put, call, takeEvery } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'
import { delay } from 'redux-saga'
import _ from 'lodash/fp'

import { SEND_TRANSACTION } from '../../actions/constants'
import { sendTransaction } from '../../actions'
import { convertedToBaseUnit } from '../../libs/units'

import transactionSaga, { handleSendTransaction, registryTxnSaga } from '../transaction'

const getDefaultState = (payload = {}) => Object.assign({}, payload)

describe('Root transaction saga', async () => {
  test('should return the root saga takeEvery', () => {
    const generator = cloneableGenerator(transactionSaga)(SEND_TRANSACTION)
    expect(generator.next().value).toEqual(takeEvery(SEND_TRANSACTION, handleSendTransaction))
  })
})

describe('Handle send transaction saga', async () => {
  test('should route the action accordingly based on methodName', () => {
    const args = [
      '0x337cDDa6D41A327c5ad456166CCB781a9722AFf9',
      convertedToBaseUnit(50, 18),
      'Listing Data',
    ]
    const payload = {
      methodName: 'apply',
      args,
      listing: null,
      contract: 'registry',
    }
    const state = getDefaultState({ payload, type: SEND_TRANSACTION })
    console.log(state)
    const action = sendTransaction(payload)
    const generator = cloneableGenerator(handleSendTransaction)(action)
    // expect(generator.next().value).toEqual(call(registryTxnSaga, action))
    // expect(generator.next().done).toEqual(true)
  })
})
