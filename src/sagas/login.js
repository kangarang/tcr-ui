import { call, put, all, takeEvery } from 'redux-saga/effects'

import truffleContract from 'truffle-contract'
import ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'

import { EXECUTE_METHOD_REQUEST, LOGIN_ERROR } from '../actions/constants'
import ABIs from '../contracts'

import { loginError, loginSuccess } from '../actions'

import { getEthjs } from '../libs/provider'
import { getDefaults } from '../services/defaults'

export default function* rootLoginSaga() {
  yield takeEvery(EXECUTE_METHOD_REQUEST, executeSaga)
}

function* executeSaga(action) {
  try {
    const eth = yield call(getEthjs)
    console.log('eth', eth)

    const { account, method, network, registry } = action.payload

    const text = `Registry: ${registry}\nNetwork: ${network}`

    const msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))

    const signed = yield call([eth, 'personal_sign'], msg, account)
    console.log('Signed! Result is: ', signed)

    const recovered = yield call([eth, 'personal_ecRecover'], msg, signed)
    console.log('recovered', recovered)

    if (recovered === account) {
      console.log('Ethjs recovered the message signer')
      console.log('Checking if deployed...')
      const deployed = yield call(
        checkIfDeployed,
        eth,
        account,
        ABIs.Registry,
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

async function checkIfDeployed(eth, account, contract, address) {
  const Contract = truffleContract(contract)
  Contract.setProvider(eth.currentProvider)
  Contract.defaults(getDefaults(account))

  try {
    const c = await Contract.at(address)
    return c
  } catch (err) {
    return err
  }
}
