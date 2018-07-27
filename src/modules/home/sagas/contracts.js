import { call, put, all, select, takeLatest } from 'redux-saga/effects'
import { removeAll } from 'react-notification-system-redux'

import { selectABIs, selectAccount } from '../selectors'

import * as actions from '../actions'
import * as types from '../types'

import * as liActions from 'modules/listings/actions'

import { getEthjs } from 'libs/provider'
import { ipfsGetData } from 'libs/ipfs'
import { baseToConvertedUnit } from 'libs/units'
import { isAddress } from 'libs/values'
import { setupRegistry, setupContract } from '../utils'

import { hardcodedRegistryAddress, getIpfsABIsHash, defaultRegistryAddress } from 'config'

export default function* contractsSagasRoot() {
  yield takeLatest(types.SET_ABIS, registrySaga)
  yield takeLatest(types.SET_REGISTRY_CONTRACT, contractsSaga)
  yield takeLatest(types.CHOOSE_TCR, registrySaga)

  yield takeLatest(types.SETUP_ETHEREUM_SUCCEEDED, abisSaga)
  yield takeLatest(types.SETUP_ETHEREUM_FAILED, abisSaga)
  yield takeLatest(types.SELECT_REGISTRY_START, registrySaga)
}

function* abisSaga(action) {
  try {
    // get abis from ipfs
    const ipfsABIsHash = yield call(getIpfsABIsHash, action.payload.network)
    const data = yield call(ipfsGetData, ipfsABIsHash)
    const { id, registry, token, voting, parameterizer } = data
    const abis = {
      id,
      registry: {
        abi: registry.abi,
        bytecode: registry.bytecode,
        networks: registry.networks,
      },
      token: { abi: token.abi, bytecode: token.bytecode },
      voting: { abi: voting.abi, bytecode: voting.bytecode },
      parameterizer: { abi: parameterizer.abi, bytecode: parameterizer.bytecode },
      address: defaultRegistryAddress,
    }

    // dispatch abis -> invokes contractSagas
    yield put(actions.setABIs(abis))
  } catch (error) {
    console.log('set abis error:', error)
  }
}

export function* registrySaga(action) {
  try {
    yield put(liActions.setListings({}))
    yield put(removeAll())
    const abis = yield select(selectABIs)
    const account = yield select(selectAccount)

    const ethjs = yield call(getEthjs)
    const networkID = yield call(ethjs.net_version)

    // if action.payload.address, use that address (CHOOSE_TCR)
    // otherwise, use the default address (factory tcr)
    let address =
      action.payload && action.payload.address !== ''
        ? action.payload.address
        : abis.registry.networks[networkID] && abis.registry.networks[networkID].address

    if (hardcodedRegistryAddress !== '') {
      address = hardcodedRegistryAddress
      console.log(
        'WARNING! You are using the hardcoded address from /src/config/registry.json:',
        address
      )
    }

    if (action.payload && action.payload.registryAddress) {
      if (isAddress(action.payload.registryAddress.toLowerCase())) {
        address = action.payload.registryAddress
      }
    }
    console.log('address:', address)

    const codeAtAddress = yield call(ethjs.getCode, address)

    if (codeAtAddress === '0x0' || codeAtAddress === '0x00') {
      console.log('ERROR! A registry was not found at the address:', address)
      console.log(
        'Notice: tcr-ui retrieves ABIs from IPFS, then loads the tcr smart contracts using the current `networkID` (same ABIs as the ones located in /scripts/abis/).'
      )
      console.log(
        'The registry MUST be deployed to a network. If you have a registry address that you want to force, hardcode it in /src/config/registry.json.'
      )
      console.log(
        'Pro-tip: If you do not want to rely on hardcoding the address, you can add a custom ABI to IPFS:'
      )
      console.log(
        '1. Edit the "address" of the appropriate "networks" section of /scripts/abis/Registry.json.'
      )
      console.log(
        '2. Run `npm run update:abis` to add your custom abis to IPFS. (note: a multihash starting with "Qm" will be printed).'
      )
      console.log(
        '3. Update the `ipfsABIsHash` variable in /src/config/index.js to the IPFS multihash.'
      )
    }

    const registry = yield call(
      setupRegistry,
      abis.registry.abi,
      abis.registry.bytecode,
      account,
      address
    )

    yield put(actions.setRegistryContract(registry))
  } catch (err) {
    console.log('registry saga err', err)
  }
}

function* contractsSaga(action) {
  try {
    const abis = yield select(selectABIs)
    const account = yield select(selectAccount)
    const registry = action.payload

    let [token, voting, parameterizer] = yield all([
      call(
        setupContract,
        abis.token.abi,
        abis.token.bytecode,
        account,
        registry,
        'token'
      ),
      call(
        setupContract,
        abis.voting.abi,
        abis.voting.bytecode,
        account,
        registry,
        'voting'
      ),
      call(
        setupContract,
        abis.parameterizer.abi,
        abis.parameterizer.bytecode,
        account,
        registry,
        'parameterizer'
      ),
    ])

    // query the contract for config data
    const [
      minDeposit,
      applyStageLen,
      commitStageLen,
      revealStageLen,
      dispensationPct,
      tokenNameResult,
      tokenDecimalsResult,
      tokenSymbolResult,
      registryNameResult,
    ] = yield all([
      call(parameterizer.get, 'minDeposit'),
      call(parameterizer.get, 'applyStageLen'),
      call(parameterizer.get, 'commitStageLen'),
      call(parameterizer.get, 'revealStageLen'),
      call(parameterizer.get, 'dispensationPct'),
      call(token.name),
      call(token.decimals),
      call(token.symbol),
      call(registry.name),
    ])
    // set the html title tag
    document.title = registryNameResult['0']

    const tokenDecimals = tokenDecimalsResult['0'].toString(10)
    const parameters = {
      // convert minDeposit based on the decimals of the token
      minDeposit: baseToConvertedUnit(minDeposit['0'].toString(10), tokenDecimals),
      applyStageLen: applyStageLen['0'].toString(10),
      commitStageLen: commitStageLen['0'].toString(10),
      revealStageLen: revealStageLen['0'].toString(10),
      dispensationPct: dispensationPct['0'].toString(10),
    }

    // dispatch: parameters, contracts, and tcr config data
    yield put(
      actions.setContracts({
        parameters,
        contracts: {
          registry,
          token,
          voting,
          parameterizer,
        },
        tcr: {
          tokenName: tokenNameResult['0'],
          tokenSymbol: tokenSymbolResult['0'],
          registryName: registryNameResult['0'],
          registryAddress: registry.address,
          tokenDecimals,
        },
      })
    )
    // refresh balances
    yield put(actions.updateBalancesStart())
  } catch (err) {
    console.log('contract err', err)
  }
}
