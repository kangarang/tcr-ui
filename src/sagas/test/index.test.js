import { genesis } from '../index'
import { setProvider } from 'libs/provider'
import { put, call } from 'redux-saga/effects';

test('genesis saga', async () => {
  const gen = await genesis()
  // expect(gen.next().value).toEqual(call(setProvider))
  gen.next()
  gen.next()
  // gen.next()
  // gen.next()
  // console.log('gen', gen)
})
