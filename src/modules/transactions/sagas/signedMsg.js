import { select, call } from 'redux-saga/effects'
// import ethUtil from 'ethereumjs-util'

import { selectAccount } from 'modules/home/selectors'
import { getEthjs } from 'libs/provider'

// async function ethPersonalSign(ethjs, account) {
//   const data = 'Sign personal message'
//   const message = ethUtil.toBuffer(data)
//   const msg = ethUtil.bufferToHex(message)
//   return ethjs.personal_sign(msg, account)
// }
// async function ethPersonalRecovery(ethjs, serialized) {
//   // same data
//   const data = 'Sign personal message'
//   const message = ethUtil.toBuffer(data)
//   const msg = ethUtil.bufferToHex(message)
//   return ethjs.personal_ecRecover(msg, serialized)
// }

async function ethSignTypedData(ethjs, from) {
  const msgParams = [
    {
      type: 'string',
      name: 'Message',
      value: 'Hi, Alice!',
    },
    {
      type: 'uint32',
      name: 'A number',
      value: '1337',
    },
  ]
  const signed = await ethjs.signTypedData(msgParams, from)
  console.log('signed:', signed)
  // const recovered = sigUtil.recoverTypedSignature({ data: msgParams, sig: signed })
  // if (recovered === from) {
  //   console.log('Successfully ecRecovered signer as ' + from)
  // } else {
  //   console.log('Failed to verify signer when comparing ' + signed + ' to ' + from)
  // }
}
export function* personalMessageSignatureRecovery() {
  const ethjs = yield call(getEthjs)
  const account = yield select(selectAccount)

  yield call(ethSignTypedData, ethjs, account)

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  // // this triggers metamask popup and waits for user to press 'sign'
  // // account must be the one signing the msg
  // const signedAndSerialized = yield call(ethPersonalSign, ethjs, account)
  // console.log('Signed and serialized!  Result is: ', signedAndSerialized)

  // console.log('Recovering...')
  // // under the hood, this unpacks the message and gets the address
  // const recovered = yield call(ethPersonalRecovery, ethjs, signedAndSerialized)

  // if (recovered === account) {
  //   console.log('Ethjs recovered the message signer!', recovered)
  // } else {
  //   console.log('Ethjs failed to recover the message signer!')
  //   console.dir({ recovered })
  // }
}
