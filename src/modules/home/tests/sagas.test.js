import { call, put, take } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
// import * as matchers from 'redux-saga-test-plan/matchers'
// import { throwError } from 'redux-saga-test-plan/providers'
import { genesis } from '../sagas'
import * as actions from '../actions'

describe('Home sagas', async () => {
  describe('saga: genesis', async () => {
    test('should fail gracefully if there is no account signed in', async () => {
      expectSaga(genesis)
        .put(actions.setupEthereumFailed({ error: new Error('Account undefined') }))
        .run()
    })
  })
})
