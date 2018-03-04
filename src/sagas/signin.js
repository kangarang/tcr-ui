import { call, select, put, takeEvery } from 'redux-saga/effects'

import truffleContract from 'truffle-contract'
import ethUtil from 'ethereumjs-util'

import { LOGIN_ERROR, EXECUTE_METHOD_REQUEST } from '../actions/constants'

import { loginError, loginSuccess } from '../actions'

import { selectEthjs, selectRegistry } from '../selectors/index'

export default function* rootLoginSaga() {
  // yield takeEvery(EXECUTE_METHOD_REQUEST, executeSaga)
}

function* executeSaga(action) {
  try {
    const ethjs = yield select(selectEthjs)
    console.log('ethjs', ethjs)

    const { account, method, network, registry } = action.payload
    console.log('method', method)

    const text = `Account:\n${account ||
      'You need MetaMask!'}\n\nRegistry:\n${registry ||
      'No registry'}\n\nNetwork: ${network || 'Unlock MetaMask!'}`

    const msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))

    const signed = yield call([ethjs, 'personal_sign'], msg, account)
    console.log('Signed! Result is: ', signed)

    const recovered = yield call([ethjs, 'personal_ecRecover'], msg, signed)
    console.log('recovered', recovered)

    const regContract = yield select(selectRegistry)

    if (recovered === account) {
      console.log('Ethjs recovered the message signer')
      console.log('Checking if deployed...')
      const deployed = yield call(
        checkIfDeployed,
        ethjs,
        account,
        regContract.contract,
        registry
      )
      console.log('deployed', deployed)
      if (deployed.contract && deployed.address === registry) {
        // Deployed
        yield put(loginSuccess({ account, network, deployed }))
      }
    } else {
      console.log('Ethjs failed to recover the message signer!')
      console.dir({ recovered })
    }
  } catch (err) {
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}

async function checkIfDeployed(ethjs, account, contract, address) {
  const Contract = truffleContract(contract)
  Contract.setProvider(ethjs.currentProvider)
  if (typeof Contract.currentProvider.sendAsync !== 'function') {
    Contract.currentProvider.sendAsync = function() {
      return Contract.currentProvider.send.apply(
        Contract.currentProvider,
        arguments
      )
    }
  }
  // Contract.defaults(getDefaults(account))

  try {
    const c = await Contract.at(address)
    return c
  } catch (err) {
    return err
  }
}
