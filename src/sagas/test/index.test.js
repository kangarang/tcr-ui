import { genesis } from '../index'
import { setProvider } from 'libs/provider'
import { put, call } from 'redux-saga/effects'

describe('Initialize sagas', async () => {
  test('genesis saga', async () => {
    const gen = await genesis()
    // expect(gen.next().value).toEqual(call(setProvider))
  })
})
