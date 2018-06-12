import React from 'react'
import { select, take, fork, put } from 'redux-saga/effects'
import {
  success,
  info,
  hide,
  // show,
  // error,
  // warning,
  // removeAll,
} from 'react-notification-system-redux'
import { selectNetwork } from '../home/selectors'
import Identicon from 'components/Identicon'

import * as types from '../transactions/types'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
  padding: 0.4em;
`

export function getEtherscanLink(network, txHash) {
  if (network === 'mainnet') {
    return (
      <FlexDiv>
        <Identicon address={txHash} diameter={14} />
        <a target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
          {'Etherscan'}
        </a>
      </FlexDiv>
    )
  }
  return (
    <FlexDiv>
      <Identicon address={txHash} diameter={14} />
      <a target="_blank" href={`https://${network}.etherscan.io/tx/${txHash}`}>
        {'Etherscan'}
      </a>
    </FlexDiv>
  )
}

export function* pendingTxns(methodName, txHash, args) {
  try {
    const network = yield select(selectNetwork)
    const noti = {
      uid: txHash,
      title: `Pending ${methodName}. Tx Hash: ${txHash.slice(0, 8)}`,
      message: getEtherscanLink(network, txHash),
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
      const action = yield take(types.SEND_TRANSACTION_SUCCEEDED)
      yield put(hide(action.payload.transactionHash))

      const noti = {
        uid: txHash,
        title: `${txHash.slice(0, 8)} mined`,
        message: getEtherscanLink(network, txHash),
        position: 'tl',
        autoDismiss: 5,
      }
      yield put(success(noti))
    }
  } catch (error) {
    console.log('minedTxn error:', error)
  }
}
