// import reducer from './reducers'

// Sagas are part of the public interface of the duck.
// Actions are encapsulated, sagas are exposed.

import * as logsSagas from './sagas'
import * as logsTypes from './types'

export { logsSagas, logsTypes }

// export default reducer

// export, as default, the reducer function of the duck.
// export, as named exports, the selectors and sagas.
// optionally, export the types if they are needed in other ducks.
