import reducer from '../reducers'
import actions from '../actions'

describe('duck reducer', function() {
  test('quack', function() {
    const quack = actions.quack()
    const initialState = false

    const result = reducer(initialState, quack)

    it('should quack', function() {
      expect(result).to.be(true)
    })
  })
})
