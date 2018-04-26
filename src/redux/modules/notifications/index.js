import React from 'react'
import { select, call, take, fork, put } from 'redux-saga/effects'
import {
  show,
  success,
  error,
  warning,
  info,
  hide,
  removeAll,
} from 'react-notification-system-redux'
import { selectNetwork } from '../home/selectors'
import Identicon from 'views/components/Identicon'

import * as types from '../transactions/types'

export function getEtherscanLink(network, txHash) {
  if (network === 'mainnet') {
    return `https://etherscan.io/tx/${txHash}`
  }
  return `https://${network}.etherscan.io/tx/${txHash}`
}

export function* pendingTxns(methodName, txHash) {
  try {
    const network = yield select(selectNetwork)
    const noti = {
      uid: txHash,
      title: `Pending ${methodName} transaction: ${txHash.slice(0, 8)}`,
      message: (
        <a target="_blank" href={`${getEtherscanLink(network, txHash)}`}>
          {'Etherscan'}
        </a>
      ),
      position: 'tl',
      autoDismiss: 0,
    }
    yield put(info(noti))
    yield fork(minedTxn, txHash)
  } catch (error) {
    console.log('notificationsSaga error:', error)
  }
}

export function* minedTxn(txHash) {
  try {
    const network = yield select(selectNetwork)

    while (true) {
      const success = yield take(types.SEND_TRANSACTION_SUCCEEDED)
      yield put(hide(success.payload.transactionHash))

      const noti = {
        uid: txHash,
        title: `${txHash.slice(0, 8)} mined`,
        message: (
          <div>
            <Identicon address={txHash} diameter={7} />
            <a target="_blank" href={`${getEtherscanLink(network, txHash)}`}>
              {'Etherscan'}
            </a>
          </div>
        ),
        position: 'tl',
        autoDismiss: 5,
      }
      yield put(info(noti))
    }
  } catch (error) {
    console.log('minedTxn error:', error)
  }
}
